import express from 'express';
import horariosController from '../controllers/horariosController.js';

const router = express.Router();

router.get('/', horariosController.getHorarios);
router.post('/', horariosController.createHorario);
router.put('/:id', horariosController.updateHorario); // 👈 nueva ruta
router.delete('/:id', horariosController.deleteHorario);

export default router;
