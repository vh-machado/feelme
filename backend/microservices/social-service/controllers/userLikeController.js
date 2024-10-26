const User = require("../models/user.model");
const Review = require("../models/review.model");
const UserLike = require("../models/userLike.model");


exports.getAllUserLikes = async (req, res) => {
  try {
    const userLikes = await UserLike.find().populate("userId", "name").populate("reviewId", "text");
    res.status(200).json(userLikes);
  } catch (err) {
    console.error("Erro ao buscar UserLikes:", err.message);
    res.status(500).send("Erro no servidor");
  }
};


exports.getUserLikeById = async (req, res) => {
  const { id } = req.params;
  try {
    const userLike = await UserLike.findById(id).populate("userId", "name").populate("reviewId", "text");
    if (!userLike) {
      return res.status(404).json({ msg: "UserLike não encontrado" });
    }
    res.status(200).json(userLike);
  } catch (err) {
    console.error("Erro ao buscar UserLike:", err.message);
    res.status(500).send("Erro no servidor");
  }
};


exports.createUserLike = async (req, res) => {
  const { userId, reviewId } = req.body;

  try {
    const user = await User.findById(userId);
    const review = await Review.findById(reviewId);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    if (!review) {
      return res.status(404).json({ msg: "Review não encontrada" });
    }


    const userLike = new UserLike({ userId, reviewId });
    await userLike.save();


    review.likes += 1;
    await review.save();

    res.status(201).json(userLike);
  } catch (err) {
    console.error("Erro ao salvar UserLike:", err.message);
    res.status(500).send("Erro no servidor");
  }
};


exports.updateUserLike = async (req, res) => {
  const { id } = req.params;
  const { userId, reviewId } = req.body;

  try {
    let userLike = await UserLike.findById(id);
    if (!userLike) {
      return res.status(404).json({ msg: "UserLike não encontrado" });
    }


    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }
    }

    if (reviewId) {
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ msg: "Review não encontrada" });
      }
    }

    userLike.userId = userId || userLike.userId;
    userLike.reviewId = reviewId || userLike.reviewId;

    await userLike.save();
    res.status(200).json(userLike);
  } catch (err) {
    console.error("Erro ao atualizar UserLike:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.checkUserLikeExists = async (req, res) => {
  const { userId, reviewId } = req.params;

  try {
    const userLike = await UserLike.findOne({ userId, reviewId });

    if (userLike) {
      return res.status(200).json({ exists: true, msg: "UserLike encontrado." });
    } else {
      return res.status(404).json({ exists: false, msg: "UserLike não encontrado." });
    }
  } catch (err) {
    console.error("Erro ao verificar UserLike:", err.message);
    res.status(500).send("Erro no servidor");
  }
};



exports.deleteUserLike = async (req, res) => {
  const { id } = req.params;

  try {
    const userLike = await UserLike.findById(id);
    if (!userLike) {
      return res.status(404).json({ msg: "UserLike não encontrado" });
    }

    const review = await Review.findById(userLike.reviewId);
    if (review) {
      review.likes -= 1;
      await review.save();
    }

    await userLike.deleteOne();
    res.status(200).json({ msg: "UserLike deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar UserLike:", err.message);
    res.status(500).send("Erro no servidor");
  }
};
