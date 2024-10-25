const User = require("../models/user.model");
const Review = require("../models/review.model");
const UserLike = require("../models/userLike.model");


exports.getAllUserLikes = async (req, res) => {
  try {
    const userLikes = await UserLike.find().populate("idUser", "name").populate("idReview", "text");
    res.status(200).json(userLikes);
  } catch (err) {
    console.error("Erro ao buscar UserLikes:", err.message);
    res.status(500).send("Erro no servidor");
  }
};


exports.getUserLikeById = async (req, res) => {
  const { id } = req.params;
  try {
    const userLike = await UserLike.findById(id).populate("idUser", "name").populate("idReview", "text");
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
  const { idUser, idReview } = req.body;

  try {
    const user = await User.findById(idUser);
    const review = await Review.findById(idReview);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    if (!review) {
      return res.status(404).json({ msg: "Review não encontrada" });
    }


    const userLike = new UserLike({ idUser, idReview });
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
  const { idUser, idReview } = req.body;

  try {
    let userLike = await UserLike.findById(id);
    if (!userLike) {
      return res.status(404).json({ msg: "UserLike não encontrado" });
    }


    if (idUser) {
      const user = await User.findById(idUser);
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }
    }

    if (idReview) {
      const review = await Review.findById(idReview);
      if (!review) {
        return res.status(404).json({ msg: "Review não encontrada" });
      }
    }

    userLike.idUser = idUser || userLike.idUser;
    userLike.idReview = idReview || userLike.idReview;

    await userLike.save();
    res.status(200).json(userLike);
  } catch (err) {
    console.error("Erro ao atualizar UserLike:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.checkUserLikeExists = async (req, res) => {
  const { idUser, idReview } = req.params;

  try {
    const userLike = await UserLike.findOne({ idUser, idReview });

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

    const review = await Review.findById(userLike.idReview);
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
