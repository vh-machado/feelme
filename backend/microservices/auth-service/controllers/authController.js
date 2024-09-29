const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Registrar usuário
exports.register = async (req, res) => {
  // Definindo valores padrão para nickname e userRole se estiverem vazios
  const { name, nickname, email, password, userRole } = req.body;
 
  try {
    // Verificar se o usuário já existe pelo email
    let user = await User.findOne({ email });
    if (user) {
      console.log('Usuário já existe:', email);
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Criar novo usuário com valores padrão se necessário
    user = new User({ name, nickname, email, password, userRole });

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Salvar o novo usuário no banco de dados
    await user.save();

    // Criar o payload para o JWT
    const payload = { user: { id: user.id, name: user.name, userRole: user.userRole } };

    // Gerar o token JWT
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

    const payload = { user: { id: user.id, name: user.name, userRole: user.userRole } };

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