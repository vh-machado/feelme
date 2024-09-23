const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Verificação do papel de admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado, administrador necessário' });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'O Token não é válido' });
  }
};

