const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Administrador } = require('../models');

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Administrador.findOne({
      where: { usuario: username }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, admin.contraseña_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.usuario }, 'secreto_admin', {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    console.error('Error en adminLogin:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { adminLogin };
