import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import subjectsRoutes from './routes/subjectsRoutes.js';  // 👈

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/categories', categoriaRoutes);
app.use('/api/subjects', subjectsRoutes); // 👈

app.get('/api/test', (req, res) => {
  res.send('Servidor API funcionando');
});

export default app;
