import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

/* monta las rutas aquí */
app.use('/api/auth', authRoutes);

app.get('/', (_, res) => res.send('Backend StratSync listo'));
export default app;
