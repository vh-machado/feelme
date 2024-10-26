const { runGemini } = require("../utils/gemini.js");
const { formatEmotion } = require("../utils/formatEmotion.js");

function generatePrompt(review) {
  return `Retorne somente e nada mais além que um objeto json com um array com apenas as emoções identificadas nesse texto: '${review}'. Resuma cada emoção com uma palavra, não faça nenhuma explicação. Use somente essa lista de emoções: Alegria, Tristeza, Raiva, Medo, Surpresa, Nojo, Satisfação, Ansiedade, Decepção, Dúvida, Frustração, Vergonha, Desespero, Entusiasmo, Alívio, Desânimo, Culpa, Indiferença, Inveja e Luto. O objeto deve conter os atributos emotions, que será o array com as emoções em string, e approval, que é um score numérico para o texto utilizando a classificação Naive Bayes.`;
}

function formatResult(result) {
  try {
    const jsonString = result.candidates[0].content.parts[0].text.replace(/```json\n|\n```/g, '');
    const formattedResult = JSON.parse(jsonString);
    return formattedResult;
  } catch (error) {
    console.error("Erro ao formatar o resultado:", error);
    throw new Error("Formato de resposta inválido");
  }
}

function computeAverageResults(analysisResults) {
  const totalApproval = analysisResults.reduce((acc, curr) => acc + curr.approval, 0);
  return totalApproval / analysisResults.length;
}

function computeEmotionsByMovie(analysisResults) {
  const emotionsCount = {};
  
  analysisResults.forEach((result) => {
    result.emotions.forEach((emotion) => {
      emotionsCount[emotion] = (emotionsCount[emotion] || 0) + 1;
    });
  });

  return emotionsCount;
}

async function runEmotionAnalysis(review) {
  const prompt = generatePrompt(review);
  
  const result = await runGemini(prompt);
  //console.log("Resultado do runGemini:", result);

  const formattedResult = formatResult(result); 

  return formattedResult
}

async function runMultipleEmotionAnalysis(reviews) {
  const analysisResults = [];

  for (const review of reviews) {
    analysisResults.push(runEmotionAnalysis(review));
  }

  return {
    averageApproval: computeAverageResults(analysisResults),
    emotionsByMovie: computeEmotionsByMovie(analysisResults),
  };
}

async function emotionAnalysis(req, res) {
  const { reviewText } = req.body;

  try {
    const analysis = await runEmotionAnalysis(reviewText)
      .then(response => formatEmotion(response.emotions))

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Erro ao processar a análise de emoções:", error.message);
    res.status(500).json({ error: "Erro ao processar a análise de emoções." });
  }
}

module.exports = { emotionAnalysis };
