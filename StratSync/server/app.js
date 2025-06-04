const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(cors({
  origin: '*', // o especifica tu frontend: 'http://localhost:3000'
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API de StratSync funcionando');
});

module.exports = app;
