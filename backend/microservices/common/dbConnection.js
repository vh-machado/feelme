const mongoose = require('mongoose');

// Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/?????', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB!');
}).catch((err) => {
  console.error('Erro ao conectar ao MongoDB', err);
});
