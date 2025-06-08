import db from '../models/index.js';
import { Op } from 'sequelize';

const { Horario, Teacher, Materia, Categoria } = db;

const getHorarios = async (req, res) => {
  try {
    const horarios = await Horario.findAll({
      include: [
        {
          model: Teacher,
          as: 'profesor'
        },
        {
          model: Materia,
          as: 'materia',
          include: [{
            model: Categoria,
            as: 'categoria'
          }]
        }
      ]
    });

    const datosFormateados = horarios.map(h => ({
      id: h.id,
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      profesor: {
        id: h.profesor.id,
        nombre: `${h.profesor.nombres} ${h.profesor.apellidos}`
      },
      materia: {
        id: h.materia.id,
        nombre: h.materia.nombre,
        categoria_id: h.materia.categoria_id,
        categoria: h.materia.categoria ? {
          id: h.materia.categoria.id,
          nombre: h.materia.categoria.nombre
        } : null
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

  // Validaciones básicas
  if (!dia_semana || !hora_inicio || !hora_fin || !profesor_id || !materia_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Validar que el profesor existe
    const profesor = await Teacher.findByPk(profesor_id);
    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    // Validar que la materia existe
    const materia = await Materia.findByPk(materia_id);
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    // Validar formato de hora (simplificado)
    if (!hora_inicio.match(/^\d{2}:\d{2}(:\d{2})?$/) || !hora_fin.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      return res.status(400).json({ error: 'Formato de hora inválido. Use HH:MM o HH:MM:SS' });
    }

    // Validar que hora_fin > hora_inicio
    if (hora_fin <= hora_inicio) {
      return res.status(400).json({ error: 'La hora de fin debe ser posterior a la hora de inicio' });
    }

    // Validar solapamiento de horarios (usando Op correctamente)
    const horarioExistente = await Horario.findOne({
      where: {
        dia_semana,
        profesor_id,
        [Op.or]: [
          {
            hora_inicio: { [Op.lt]: hora_fin },
            hora_fin: { [Op.gt]: hora_inicio }
          }
        ]
      }
    });

    if (horarioExistente) {
      return res.status(409).json({ 
        error: 'El profesor ya tiene un horario asignado en ese rango',
        conflicto: {
          id: horarioExistente.id,
          dia: horarioExistente.dia_semana,
          inicio: horarioExistente.hora_inicio,
          fin: horarioExistente.hora_fin,
          materia: horarioExistente.materia_id
        }
      });
    }

    // Crear el nuevo horario
    const nuevoHorario = await Horario.create({
      dia_semana,
      hora_inicio,
      hora_fin,
      profesor_id,
      materia_id
    });

    // Obtener el horario con relaciones para la respuesta
    const horarioCompleto = await Horario.findByPk(nuevoHorario.id, {
      include: [
        { association: 'profesor', attributes: ['id', 'nombres', 'apellidos'] },
        { 
          association: 'materia',
          attributes: ['id', 'nombre'],
          include: [{
            association: 'categoria',
            attributes: ['id', 'nombre']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: horarioCompleto
    });

  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al crear horario',
      message: error.message 
    });
  }
};;
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
