// client/src/services/authService.js

export const adminLogin = async (usuario, contraseña) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/admin-login`, {
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
