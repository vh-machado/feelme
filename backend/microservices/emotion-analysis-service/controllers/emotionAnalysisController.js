const { runGemini } = require("../utils/gemini.js");
const EmotionAnalysis = require("../models/emotionAnalysis.js");

let requestQueue = [];
let processing = false;

function enqueueRequest(request) {
  requestQueue.push(request);
  processQueue();
}

async function processQueue() {
  if (processing || requestQueue.length === 0) return;

  processing = true;
  const { reviewText, idReview, res } = requestQueue.shift();

  try {
    const result = await runEmotionAnalysis(reviewText, idReview);
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
  return `Retorne somente e nada mais além que um objeto json com um array com apenas as emoções identificadas nesse texto: '${review}'. Cada emoção deve conter um campo "emoji" com um emoji representativo e um campo "description" com a descrição. Use somente esta lista de emoções: Alegria, Tristeza, Raiva, Medo, Surpresa, Nojo, Satisfação, Ansiedade, Decepção, Dúvida, Frustração, Vergonha, Desespero, Entusiasmo, Alívio, Desânimo, Culpa, Indiferença, Inveja e Luto.`;
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

async function runEmotionAnalysis(reviewText, idReview) {
  const prompt = generatePrompt(reviewText);
  const result = await runGemini(prompt);

  const emotions = formatEmotions(result);
  console.log(emotions);


  const existingAnalysis = await EmotionAnalysis.findOne({ idReview });

  if (existingAnalysis) {
    existingAnalysis.emotions = emotions;
    await existingAnalysis.save();
    return existingAnalysis;
  } else {
    const savedAnalysis = await EmotionAnalysis.create({
      idReview,
      emotions,
    });
    return savedAnalysis;
  }
}

async function emotionAnalysis(req, res) {
  const { reviewText, idReview } = req.body;
  enqueueRequest({ reviewText, idReview, res });
}

async function getEmotionAnalysisByIdReview(req, res) {
  const { idReview } = req.params;

  try {
    const analysis = await EmotionAnalysis.findOne({ idReview });
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

module.exports = { emotionAnalysis, getEmotionAnalysisByIdReview, deleteEmotionAnalysisById };
