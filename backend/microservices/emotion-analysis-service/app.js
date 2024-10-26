require('dotenv').config();
const express = require('express');
const app = express();
const os = require('os');
const connectDB = require('./config/database');



// Conectar ao MongoDB
connectDB();


app.use(express.json({ extended: false }));


app.use('/api', require('./routes/emotionAnalysis'));


const PORT = process.env.PORT || 5004;


const getHostName = () => {
    if (process.env.NODE_ENV === 'PRODUCAO') {
        return os.hostname(); 
    }
    return 'localhost'; 
};

// Iniciar o servidor
app.listen(PORT, () => {
    const host = getHostName();
    const serviceUrl = `http://${host}:${PORT}/api`;
    console.log(`URL de requisição para o serviço de gemini: ${serviceUrl}/emotionAnalysis`);
    console.log(`Servidor iniciado na porta: ${PORT}`);
});
