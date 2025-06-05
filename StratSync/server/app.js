import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js'; // 👈 nuevo

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes); // 👈 nuevo

export default app;
