const { runGemini } = require("./gemini.js");

// Função para gerar o prompt com base no texto de entrada
function generatePrompt(review) {
  return `Retorne somente e nada mais além que um objeto json com um array com apenas as emoções identificadas nesse texto: '${review}'. Resuma cada emoção com uma palavra, não faça nenhuma explicação. Use somente essa lista de emoções: Joy, Sadness, Anger, Fear, Surprise, Disgust, Satisfaction, Anxiety, Disappointment, Doubt, Frustration, Shame, Despair, Enthusiasm, Relief, Discouragement, Guilt, Indifference, Envy, Grief. O objeto deve conter os atributos emotions, que será o array com as emoções em string, e approval, que é um score numérico para o texto utilizando a classificação Naive Bayes.`;
}

// Função para formatar o resultado de texto para JSON
function formatResult(result) {
  try {
    // Acesse o texto da parte
    const jsonString = result.candidates[0].content.parts[0].text.replace(/```json\n|\n```/g, '');
    // Aqui espera-se que jsonString seja uma string JSON válida
    const formattedResult = JSON.parse(jsonString);
    return formattedResult;
  } catch (error) {
    console.error("Erro ao formatar o resultado:", error);
    throw new Error("Formato de resposta inválido");
  }
}

// Função para calcular o escore médio de aprovação
function computeAverageResults(analysisResults) {
  const totalApproval = analysisResults.reduce((acc, curr) => acc + curr.approval, 0);
  return totalApproval / analysisResults.length;
}

// Função para compilar as emoções por revisão
function computeEmotionsByMovie(analysisResults) {
  const emotionsCount = {};
  
  analysisResults.forEach((result) => {
    result.emotions.forEach((emotion) => {
      emotionsCount[emotion] = (emotionsCount[emotion] || 0) + 1;
    });
  });

  return emotionsCount;
}

// Função principal que executa a análise de emoções em várias revisões
async function runEmotionAnalysis(reviews) {
  const analysisResults = [];

  for (const review of reviews) {
    const prompt = generatePrompt(review);
    
    // Chamada ao runGemini
    const result = await runGemini(prompt);
    console.log("Resultado do runGemini:", result);

    // Acesse o conteúdo das emoções
    const formattedResult = formatResult(result); // Formate o conteúdo
    analysisResults.push(formattedResult);
  }

  return {
    averageApproval: computeAverageResults(analysisResults),
    emotionsByMovie: computeEmotionsByMovie(analysisResults),
  };
}

// Controlador que recebe a lista de revisões e executa a análise completa
async function emotionAnalysis(req, res) {
  const { reviews } = req.body;

  try {
    const analysis = await runEmotionAnalysis(reviews);
    res.status(200).json(analysis);
  } catch (error) {
    console.error("Erro ao processar a análise de emoções:", error.message);
    res.status(500).json({ error: "Erro ao processar a análise de emoções." });
  }
}

module.exports = { emotionAnalysis };
