import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import subjectsRoutes from './routes/subjectsRoutes.js';
import horariosRoutes from './routes/horariosRoutes.js';
import teacherAuthRoutes from './routes/teacherAuthRoutes.js';
import reportesRoutes from './routes/reportesRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();


const allowedOrigins = [
  'https://stratsync-backend.onrender.com', // opcional si haces peticiones internas
  'https://schedules.stratfordlernen.com' // reemplaza con tu dominio real
  'http://localhost:3000' // 👈 necesario para desarrollo local
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/teacher-auth', teacherAuthRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/categories', categoriaRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.send('Servidor API funcionando');
});

export default app;