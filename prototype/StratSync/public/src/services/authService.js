import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const loginUser = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export const loginAdmin = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/admin-login`, { 
      username, 
      password 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión como administrador');
  }
};

export const logoutUser = async () => {
  // Lógica para limpiar el token en el servidor si es necesario
  return Promise.resolve();
};