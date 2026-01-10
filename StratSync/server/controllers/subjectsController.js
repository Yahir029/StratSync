// controllers/subjectsController.js
import db from '../models/index.js';
const { Materia, Categoria } = db;

export const getAllSubjects = async (req, res) => {
  try {
    const materias = await Materia.findAll({
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre'] // Solo trae estos campos
      }],
      order: [['id', 'ASC']],
      raw: true,  // ← Cambia a true para datos planos
      nest: true  // ← Convierte a estructura anidada
    });

    // Formatea la respuesta para coincidir con tu frontend
    const response = materias.map(m => ({
      id: m.id,
      nombre: m.nombre,
      codigo: m.codigo,
      descripcion: m.descripcion,
      categoria_id: m.categoria_id,
      Categorium: m.categoria ? {  // ← Usa el nombre que espera tu frontend
        id: m.categoria.id,
        nombre: m.categoria.nombre
      } : null
    }));

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Error al obtener materias',
      error: error.message 
    });
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
