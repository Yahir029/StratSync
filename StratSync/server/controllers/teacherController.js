import db from '../models/index.js'; // Ajusta según cómo importas tu instancia Sequelize
const Teacher = db.Teacher;

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener profesores', error });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el profesor', error });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear profesor', error });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Teacher.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedTeacher = await Teacher.findByPk(id);
      return res.json(updatedTeacher);
    }
    res.status(404).json({ message: 'Profesor no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar profesor', error });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Teacher.destroy({
      where: { id }
    });
    if (deleted) {
      return res.json({ message: 'Profesor eliminado' });
    }
    res.status(404).json({ message: 'Profesor no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar profesor', error });
  }
};
