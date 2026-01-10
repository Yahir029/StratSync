import db from '../models/index.js';
const { sequelize } = db;

export const loginAdmin = async (req, res) => {
  const { usuario, contraseña } = req.body;
  console.log('usuario:', usuario, 'contraseña:', contraseña);

  try {
    const [result] = await sequelize.query(
      `SELECT id, usuario FROM administradores
       WHERE usuario = $1
       AND contraseña_hash = crypt($2, contraseña_hash)`,
      {
        bind: [usuario, contraseña],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result) {
      res.status(200).json({
        message: 'Login exitoso',
        admin: result,
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en loginAdmin:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
