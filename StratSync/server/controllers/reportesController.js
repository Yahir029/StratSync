import db from '../models/index.js';
const { Teacher, Horario, Materia } = db;

export const getTeachersSchedules = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [{
        model: Horario,
        as: 'horarios', // 🔥 Debe coincidir con el alias en Teacher
        include: [{
          model: Materia,
          as: 'materia' // 🔥 Debe coincidir con el alias en Horario
        }]
      }],
      order: [['apellidos', 'ASC'], ['nombres', 'ASC']]
    });

    // Formatear los datos para el frontend
    const formattedTeachers = teachers.map(teacher => {
      const horarios = teacher.horarios.map(h => ({
        grupo: h.grupo || 'N/A', // Si no tienes grupos, puedes omitir esto
        materia: h.materia?.nombre || 'Sin materia asignada',
        horario: `${getDiaSemana(h.dia_semana)} ${h.hora_inicio} - ${h.hora_fin}`
      }));

      return {
        id: teacher.id,
        profesor: `${teacher.nombres} ${teacher.apellidos}`,
        horarios
      };
    });

    res.json(formattedTeachers);
  } catch (error) {
    console.error('Error al obtener horarios de profesores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función auxiliar para convertir número de día a texto
const getDiaSemana = (diaNum) => {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return dias[diaNum - 1] || `Día ${diaNum}`;
};