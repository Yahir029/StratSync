import db from '../models/index.js';
const Teacher = db.Teacher;
const Categoria = db.Categoria;

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }],
      order: [['id', 'ASC']]
    });
    res.json(teachers);
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ 
      message: 'Error al obtener profesores',
      error: error.message 
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await Teacher.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    });
    
    if (!teacher) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    
    res.json(teacher);
  } catch (error) {
    console.error('Error al obtener profesor:', error);
    res.status(500).json({ 
      message: 'Error al obtener el profesor',
      error: error.message 
    });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { categoria_id, ...teacherData } = req.body;
    
    const newTeacher = await Teacher.create({
      ...teacherData,
      categoria_id: categoria_id || null
    });
    
    // Obtener el profesor recién creado con su categoría
    const createdTeacher = await Teacher.findByPk(newTeacher.id, {
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    });
    
    res.status(201).json(createdTeacher);
  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ 
      message: 'Error al crear profesor',
      error: error.message,
      details: error.errors?.map(e => e.message) 
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const { categoria_id, ...updateData } = req.body;
    
    const [updated] = await Teacher.update(
      { ...updateData, categoria_id: categoria_id || null },
      { where: { id } }
    );
    
    if (updated) {
      const updatedTeacher = await Teacher.findByPk(id, {
        include: [{
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }]
      });
      return res.json(updatedTeacher);
    }
    
    res.status(404).json({ message: 'Profesor no encontrado' });
  } catch (error) {
    console.error('Error al actualizar profesor:', error);
    res.status(500).json({ 
      message: 'Error al actualizar profesor',
      error: error.message,
      details: error.errors?.map(e => e.message) 
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Teacher.destroy({
      where: { id }
    });
    
    if (deleted) {
      return res.json({ 
        message: 'Profesor eliminado',
        deletedId: id
      });
    }
    
    res.status(404).json({ message: 'Profesor no encontrado' });
  } catch (error) {
    console.error('Error al eliminar profesor:', error);
    res.status(500).json({ 
      message: 'Error al eliminar profesor',
      error: error.message 
    });
  }
};
