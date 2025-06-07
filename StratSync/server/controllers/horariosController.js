import db from '../models/index.js';

const { Horario, Teacher, Materia } = db;

const getHorarios = async (req, res) => {
  try {
    const horarios = await Horario.findAll({
      include: [
        { model: Teacher, as: 'profesor' },
        { model: Materia, as: 'materia' }
      ]
    });

    const datosFormateados = horarios.map(h => ({
      id: h.id,
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      profesor: {
        id: h.profesor.id,
        nombre: h.profesor.nombre
      },
      materia: {
        id: h.materia.id,
        nombre: h.materia.nombre
      }
    }));

    res.json(datosFormateados);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ error: 'Error al obtener horarios.' });
  }
};

const createHorario = async (req, res) => {
  const { dia_semana, hora_inicio, hora_fin, profesor_id, materia_id } = req.body;

  try {
    const nuevo = await Horario.create({
      dia_semana,
      hora_inicio,
      hora_fin,
      profesor_id,
      materia_id
    });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ error: 'Error al crear horario.' });
  }
};

const updateHorario = async (req, res) => {
  const { id } = req.params;
  const { dia_semana, hora_inicio, hora_fin, profesor_id, materia_id } = req.body;

  try {
    const horario = await Horario.findByPk(id);
    if (!horario) return res.status(404).json({ error: 'Horario no encontrado' });

    await horario.update({
      dia_semana,
      hora_inicio,
      hora_fin,
      profesor_id,
      materia_id
    });

    res.json({ message: 'Horario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ error: 'Error al actualizar horario.' });
  }
};

const deleteHorario = async (req, res) => {
  const { id } = req.params;

  try {
    const horario = await Horario.findByPk(id);
    if (!horario) return res.status(404).json({ error: 'Horario no encontrado' });

    await horario.destroy();
    res.json({ message: 'Horario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ error: 'Error al eliminar horario.' });
  }
};

export default {
  getHorarios,
  createHorario,
  updateHorario,
  deleteHorario
};
