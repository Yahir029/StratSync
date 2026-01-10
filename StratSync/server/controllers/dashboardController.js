import db from '../models/index.js';

const { Materia, Teacher, Horario } = db;

export const getDashboardData = async (req, res) => {
  try {
    // Obtener datos en paralelo para mejor rendimiento
    const [totalCourses, totalTeachers, schedules] = await Promise.all([
      Materia.count(),
      Teacher.count(),
      Horario.findAll({
        include: [
          {
            model: Teacher,
            as: 'profesor',
            attributes: ['nombres', 'apellidos']
          },
          {
            model: Materia,
            as: 'materia',
            attributes: ['nombre']
          }
        ],
        order: [
          ['dia_semana', 'ASC'],
          ['hora_inicio', 'ASC']
        ]
      })
    ]);

    // Formatear los horarios
    const formattedSchedules = schedules.map(schedule => ({
      id: schedule.id,
      dia_semana: schedule.dia_semana,
      hora_inicio: schedule.hora_inicio,
      hora_fin: schedule.hora_fin,
      descripcion: schedule.descripcion,
      materia: {
        nombre: schedule.materia?.nombre || 'Sin materia'
      },
      profesor: {
        nombres: schedule.profesor?.nombres || '',
        apellidos: schedule.profesor?.apellidos || ''
      }
    }));

    res.json({
      totalCourses,
      totalTeachers,
      schedules: formattedSchedules
    });
    
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};