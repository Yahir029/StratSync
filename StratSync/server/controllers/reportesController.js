import db from '../models/index.js';
const { Teacher, Horario, Materia, Categoria } = db;

// controllers/reportesController.js
export const getTeachersSchedules = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [{
        model: Horario,
        as: 'horarios',
        include: [{
          model: Materia,
          as: 'materia',
          include: [{
            model: Categoria,
            as: 'categoria'
          }]
        }]
      }],
      order: [['apellidos', 'ASC'], ['nombres', 'ASC']]
    });

    // Formatear los datos CORRECTAMENTE
    const formattedTeachers = teachers.map(teacher => {
      const horarios = teacher.horarios.map(h => ({
        materia: h.materia?.nombre || 'Sin materia',
        categoria: h.materia?.categoria?.nombre || 'Sin categoría', // Añadido
        horario: `${getDiaSemana(h.dia_semana)} ${h.hora_inicio} - ${h.hora_fin}`,
        descripcion: h.descripcion || 'Sin descripción' // Añadido
      }));

      return {
        id: teacher.id,
        profesor: `${teacher.nombres} ${teacher.apellidos}`,
        horarios // Ahora incluye categoría y descripción
      };
    });

    res.json(formattedTeachers);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};
// Función auxiliar para convertir número de día a texto
const getDiaSemana = (diaNum) => {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return dias[diaNum - 1] || `Día ${diaNum}`;
};