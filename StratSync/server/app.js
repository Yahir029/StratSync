import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import subjectsRoutes from './routes/subjectsRoutes.js';
import horariosRoutes from './routes/horariosRoutes.js';
import teacherAuthRoutes from './routes/teacherAuthRoutes.js'; // 👈 Nuevo
import reportesRoutes from './routes/reportesRoutes.js'; 

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/teacher-auth', teacherAuthRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/categories', categoriaRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/reportes', reportesRoutes);
// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.send('Servidor API funcionando');
});

export default app;
