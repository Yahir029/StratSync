const { getAdminByUsuario } = require('../models/administrador');

exports.adminLogin = async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const admin = await getAdminByUsuario(usuario);
    if (!admin) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    // Aquí verifica password con bcrypt o como uses
    // Si ok:
    res.json({ message: 'Login exitoso' });
  } catch (error) {
    console.error('Error en adminLogin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
