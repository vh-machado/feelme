const EmotionAnalysis = require("../models/EmotionAnalysis.model");
const Review = require("../../review-service/models/review.model");

exports.getEmotionAnalysis = async (res) => {
  try {
    const reviews = await EmotionAnalysis.find().populate("idReview");
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Erro ao buscar critícas:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.saveEmotionAnalysis = async (req, res) => {
  const { id, idReview, emotions } = req.body;

  try {
    const review = await Review.findById(idReview);

    if (!review) {
      return res.status(404).json({ msg: "Critíca não encontrada" });
    }

    const emotionAnalysis = new EmotionAnalysis({
      id,
      idReview,
      emotions,
    });

    await emotionAnalysis.save();
    res.status(201).json(emotionAnalysis);
  } catch (err) {
    console.error("Erro ao salvar Análise Emocional:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.updateEmotionAnalysis = async (req, res) => {
  const { id } = req.params;
  const { idReview, emotions } = req.body;

  try {
    let emotionAnalysis = await EmotionAnalysis.findById(id);

    if (!emotionAnalysis) {
      return res.status(404).json({ msg: "Análise Emocional não encontrada" });
    }

    emotionAnalysis.idReview = idReview || review.idReview;
    emotionAnalysis.emotions = emotions || review.emotions;

    await emotionAnalysis.save();
    res.status(200).json(emotionAnalysis);
  } catch (err) {
    console.error("Erro ao atualizar Análise Emocional:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.deleteEmotionAnalysis = async (req, res) => {
  const { id } = req.params;

  try {
    const emotionAnalysis = await EmotionAnalysis.findById(id);

    if (!emotionAnalysis) {
      return res.status(404).json({ msg: "Análise Emocional não encontrada" });
    }

    await emotionAnalysis.remove();
    res.status(200).json({ msg: "Análise Emocional deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar Análise Emocional:", err.message);
    res.status(500).send("Erro no servidor");
  }
};
