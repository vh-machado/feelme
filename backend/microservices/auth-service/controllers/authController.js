const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar usuário
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Iniciando a função de register...');
  
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Usuário já existe:', email);
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error('Erro ao gerar o token JWT:', err.message);
          throw err;
        }
        console.log('Usuário registrado com sucesso:', user.id);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Erro no servidor durante o registro:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Login do usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Iniciando a função de login...');

  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Usuário não encontrado:', email);
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Senha inválida para o usuário:', email);
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error('Erro ao gerar o token JWT:', err.message);
          throw err;
        }
        console.log('Login realizado com sucesso para o usuário:', user.id);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Erro no servidor durante o login:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Obter todos os usuários
exports.getAllUsers = async (req, res) => {
  console.log('Iniciando getAllUsers...');
  
  try {
    const users = await User.find().select('-password'); // Não retornar a senha
    console.log('Usuários encontrados:', users.length);
    res.json(users);
  } catch (err) {
    console.error('Erro no servidor ao obter usuários:', err.message);
    res.status(500).send('Erro no servidor');
  }
};
