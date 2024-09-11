const User = require("../../user-service/models/user.model");

exports.getUser = async (res) => {
  try {
    const user = await User.find().populate("id");
    res.status(200).json(user);
  } catch (err) {
    console.error("Erro ao buscar User:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.saveUser = async (req, res) => {
  const { id, name, nickname, email, password } = req.body;

  try {
    const user = new User({
      id,
      name,
      nickname,
      email,
      password,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Erro ao salvar Usuário:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, nickname, email, password } = req.body;

  try {
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    user.name = name || user.name;
    user.nickname = nickname || user.nickname;
    user.password = password || user.password;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error("Erro ao atualizar Usuário:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    await user.remove();
    res.status(200).json({ msg: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar Usuário:", err.message);
    res.status(500).send("Erro no servidor");
  }
};
