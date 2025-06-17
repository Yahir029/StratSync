import express from 'express';
import { getTeachersSchedules } from '../controllers/reportesController.js';

const router = express.Router();

router.get('/profesores-horarios', getTeachersSchedules);

export default router;