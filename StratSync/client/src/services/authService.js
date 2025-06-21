// client/src/services/authService.js

const API_BASE = process.env.REACT_APP_API_URL;

export const adminLogin = async (usuario, contraseña) => {
  const response = await fetch(`${API_BASE}/api/auth/admin-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usuario, contraseña }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en login administrador');
  }

  return response.json();
};

export const teacherLogin = async (codigoAcceso) => {
  const response = await fetch(`${API_BASE}/api/teacher-auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ codigoAcceso }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en login de maestro');
  }

  return response.json();
};