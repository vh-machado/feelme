const User = require("../models/user.model");
const UserFollowers = require("../models/userFollowers.model");

exports.getAllUserFollowers = async (req, res) => {
  try {
    const followers = await UserFollowers.find()
      .populate("userIdFrom", "name nickname")
      .populate("userIdTo", "name nickname");
    res.status(200).json(followers);
  } catch (err) {
    console.error("Erro ao buscar seguidores:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.getUserFollowersById = async (req, res) => {
  const { id } = req.params;
  try {
    const follower = await UserFollowers.findById(id)
      .populate("userIdFrom", "name nickname")
      .populate("userIdTo", "name nickname");
    if (!follower) {
      return res.status(404).json({ msg: "Seguidor não encontrado" });
    }
    res.status(200).json(follower);
  } catch (err) {
    console.error("Erro ao buscar seguidor:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.createUserFollower = async (req, res) => {
  const { userIdFrom, userIdTo } = req.body;

  try {
    const userTo = await User.findById(userIdTo);
    const userFrom = await User.findById(userIdFrom);

    if (!userTo) {
      return res.status(404).json({ msg: "Usuário a ser seguido não encontrado" });
    }

    if (!userFrom) {
      return res.status(404).json({ msg: "Usuário que está seguindo não encontrado" });
    }

    const userFollower = new UserFollowers({ userIdFrom, userIdTo });
    await userFollower.save();
    await updateFollowersCount(userIdTo);

    res.status(201).json(userFollower);
  } catch (err) {
    console.error("Erro ao salvar seguidor:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.deleteUserFollower = async (req, res) => {
  const { id } = req.params;

  try {
    const follower = await UserFollowers.findById(id);
    if (!follower) {
      return res.status(404).json({ msg: "Seguidor não encontrado" });
    }

    await follower.deleteOne();
    await updateFollowersCount(follower.userIdTo);

    res.status(200).json({ msg: "Seguidor deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar seguidor:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.getFollowersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await UserFollowers.find({ userIdTo: userId })
      .populate("userIdFrom", "name nickname");
    res.status(200).json(followers);
  } catch (err) {
    console.error("Erro ao buscar seguidores do usuário:", err.message);
    res.status(500).send("Erro no servidor");
  }
};


async function updateFollowersCount(userId) {
  const count = await UserFollowers.countDocuments({ userIdTo: userId });
  await User.findByIdAndUpdate(userId, { followers: count });
}
