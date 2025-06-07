// controllers/subjectsController.js
import db from '../models/index.js';
const { Materia, Categoria } = db;

export const getAllSubjects = async (req, res) => {
  try {
    const materias = await Materia.findAll({
      include: { model: Categoria, attributes: ['id', 'nombre'] },
      order: [['id', 'ASC']],
    });
    res.json(materias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las materias', error });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { nombre, codigo, descripcion, categoria_id } = req.body;
    const nueva = await Materia.create({ nombre, codigo, descripcion, categoria_id });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la materia', error });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, descripcion, categoria_id } = req.body;
    const materia = await Materia.findByPk(id);
    if (!materia) return res.status(404).json({ message: 'Materia no encontrada' });

    await materia.update({ nombre, codigo, descripcion, categoria_id });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la materia', error });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const materia = await Materia.findByPk(id);
    if (!materia) return res.status(404).json({ message: 'Materia no encontrada' });

    await materia.destroy();
    res.json({ message: 'Materia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la materia', error });
  }
};
