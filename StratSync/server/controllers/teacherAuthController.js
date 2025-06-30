// server/controllers/teacherAuthController.js
import db from '../models/index.js';
const { Teacher } = db;

export const loginTeacher = async (req, res) => {
  try {
    const { codigoAcceso } = req.body;
    //console.log('🔐 Código recibido:', codigoAcceso);
    console.log('🔐 Ingresando con un codigo');

    const teacher = await Teacher.findOne({ where: { codigo_acceso_maestro: codigoAcceso } });

    if (!teacher) {
      return res.status(401).json({ error: 'Credenciales inválidas. Por favor intente nuevamente.' });
    }

    res.json({ message: 'Acceso concedido', teacher });
  } catch (error) {
    console.error('🔥 Error real en loginTeacher:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
