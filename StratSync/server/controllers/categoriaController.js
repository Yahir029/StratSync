// controllers/categoriaController.js
import db from '../models/index.js';

export const getCategorias = async (req, res) => {
  try {
    const categorias = await db.Categoria.findAll({ order: [['nombre', 'ASC']] });
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

export const createCategoria = async (req, res) => {
  const { nombre } = req.body;
  try {
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    // Evitar duplicados
    const existente = await db.Categoria.findOne({ where: { nombre } });
    if (existente) {
      return res.status(409).json({ message: 'La categoría ya existe' });
    }

    const nueva = await db.Categoria.create({ nombre: nombre.trim() });
    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear categoría' });
  }
};

export const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await db.Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await categoria.destroy();
    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar categoría' });
  }
};
