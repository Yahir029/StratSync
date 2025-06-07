// routes/subjectsRoutes.js
import express from 'express';
import * as subjectsController from '../controllers/subjectsController.js';
const router = express.Router();

router.get('/', subjectsController.getAllSubjects);
router.post('/', subjectsController.createSubject);
router.put('/:id', subjectsController.updateSubject);
router.delete('/:id', subjectsController.deleteSubject);

export default router;
