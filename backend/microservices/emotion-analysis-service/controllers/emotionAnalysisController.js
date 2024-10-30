const { runGemini } = require("../utils/gemini.js");
const EmotionAnalysis = require("../models/emotionAnalysis.js");
const Review = require("../models/review.model.js");
const { formatEmojiEmotion } = require("../utils/formatEmojiEmotion.js");

let requestQueue = [];
let processing = false;

function enqueueRequest(request) {
  requestQueue.push(request);
  processQueue();
}

async function processQueue() {
  if (processing || requestQueue.length === 0) return;

  processing = true;
  const { reviewText, reviewId, res } = requestQueue.shift();

  try {
    const result = await runEmotionAnalysis(reviewText, reviewId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao processar a análise de emoções:", error.message);
    res.status(500).json({ error: "Erro ao processar a análise de emoções." });
  } finally {
    processing = false;
    processQueue();
  }
}

function generatePrompt(review) {
  return `Retorne somente e nada mais além que um objeto json com um array com apenas as emoções identificadas nesse texto: '${review}'. Resuma cada emoção com uma palavra, não faça nenhuma explicação. Use somente essa lista de emoções: Alegria, Tristeza, Raiva, Medo, Surpresa, Nojo, Satisfação, Ansiedade, Decepção, Dúvida, Frustração, Vergonha, Desespero, Entusiasmo, Alívio, Desânimo, Culpa, Indiferença, Inveja e Luto. O objeto deve conter os atributos emotions, que será o array com as emoções em string, e approval, que é um score numérico para o texto utilizando a classificação Naive Bayes.`;
}

function formatEmotions(result) {
  try {
    const jsonString = result.candidates[0].content.parts[0].text.replace(/```json\n|\n```/g, '');
    const parsedResult = JSON.parse(jsonString);
    return parsedResult; 
  } catch (error) {
    console.error("Erro ao formatar o resultado:", error);
    throw new Error("Formato de resposta inválido");
  }
}

async function runEmotionAnalysis(reviewText, reviewId) {
  const prompt = generatePrompt(reviewText);
  const result = await runGemini(prompt);

  const emotions = formatEmojiEmotion(formatEmotions(result).emotions);

  const existingAnalysis = await EmotionAnalysis.findOne({ reviewId });

  if (existingAnalysis) {
    existingAnalysis.emotions = emotions;
    await existingAnalysis.save();
    return existingAnalysis;
  } else {
    const savedAnalysis = await EmotionAnalysis.create({
      reviewId,
      emotions,
    });
    return savedAnalysis;
  }
}

async function emotionAnalysis(req, res) {
  const { reviewText, reviewId } = req.body;
  enqueueRequest({ reviewText, reviewId, res });
}

async function getEmotionAnalysisByReviewId(req, res) {
  const { reviewId } = req.params;

  try {
    const analysis = await EmotionAnalysis.findOne({ reviewId });
    if (!analysis) return res.status(404).json({ error: "Análise não encontrada." });

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Erro ao buscar análise:", error.message);
    res.status(500).json({ error: "Erro ao buscar análise." });
  }
}

async function deleteEmotionAnalysisById(req, res) {
  const { id } = req.params;

  try {
    const deletedAnalysis = await EmotionAnalysis.findByIdAndDelete(id);
    if (!deletedAnalysis) return res.status(404).json({ error: "Análise não encontrada para exclusão." });

    res.status(200).json({ message: "Análise deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar análise:", error.message);
    res.status(500).json({ error: "Erro ao deletar análise." });
  }
}

async function getAllEmotionAnalysisByUserId(req, res) {
  const { userId } = req.params;

  try {
    const analyses = await EmotionAnalysis.find()
      .populate({
        path: "reviewId",
        populate: {
          path: "userMovieId",
          match: { userId },
        },
      })
      .lean();

    const userAnalyses = analyses.filter(
      (analysis) => analysis.reviewId && analysis.reviewId.userMovieId
    ).map((analysis) => ({
      emotions: analysis.emotions,
    }));

    const computedEmotions = []

    for (const analysis of userAnalyses) {
      for (const emotion of analysis.emotions) {
        let foundEmotion = computedEmotions.find(e => e.description === emotion.description )
        let index = computedEmotions.indexOf(foundEmotion)

        if(foundEmotion) {
          let counter = foundEmotion.counter + 1
          computedEmotions[index] = {
            emoji: foundEmotion.emoji,
            description: foundEmotion.description,
            counter
          }
        } else {
          computedEmotions.push({
            description: emotion.description,
            emoji: emotion.emoji,
            counter: 1
          })
        }
      }
    }

    res.status(200).json(computedEmotions);
  } catch (error) {
    console.error("Erro ao buscar análises do usuário:", error.message);
    res.status(500).json({ error: "Erro ao buscar análises do usuário." });
  }
}

async function getMoviesByPositiveEmotions(req, res) {
  const { userId } = req.params;

  try {

    const analyses = await EmotionAnalysis.find({
      "emotions.description": { $in: ["Alegria", "Satisfação", "Entusiasmo"] },
    })
      .populate({
        path: "reviewId",
        populate: {
          path: "userMovieId",
          match: { userId },
          select: "movieId",
        },
      })
      .lean();


    const movieIds = analyses
      .filter(
        (analysis) => analysis.reviewId && analysis.reviewId.userMovieId
      )
      .map((analysis) => analysis.reviewId.userMovieId.movieId);

    // Remove IDs duplicados
    const uniqueMovieIds = [...new Set(movieIds)];

    if (!uniqueMovieIds.length) {
      uniqueMovieIds = []
    }

    res.status(200).json(uniqueMovieIds);
  } catch (error) {
    console.error("Erro ao buscar filmes por emoções positivas:", error.message);
    res.status(500).json({ error: "Erro ao buscar filmes por emoções positivas." });
  }
}


module.exports = { emotionAnalysis, getEmotionAnalysisByReviewId, deleteEmotionAnalysisById, getAllEmotionAnalysisByUserId, getMoviesByPositiveEmotions 
};
