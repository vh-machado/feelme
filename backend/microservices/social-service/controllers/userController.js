const User = require("../models/user.model");

exports.getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    console.error("Erro ao buscar User:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    console.error("Erro ao buscar User:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.saveUser = async (req, res) => {
  const { id, name, nickname, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Nome, email e senha são obrigatórios" });
  }

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
  const updateFields = req.body;

  if (!Object.keys(updateFields).length) {
    return res.status(400).json({ msg: "Pelo menos um campo deve ser atualizado" });
  }

  try {
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    
    Object.keys(updateFields).forEach((key) => {
      user[key] = updateFields[key];
    });

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

    await user.deleteOne();
    res.status(200).json({ msg: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar Usuário:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.getSearchUser = async (req, res) => {
  const { query } = req.query; 

  try {

    if (!query) {
      return res.status(400).json({ msg: "O parâmetro 'query' é obrigatório." });
    }


    const regex = new RegExp(query, "i"); 

    const users = await User.find({
      $or: [
        { name: { $regex: regex } },      
        { nickname: { $regex: regex } }  
      ]
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err.message);
    res.status(500).send("Erro no servidor");
  }
};
