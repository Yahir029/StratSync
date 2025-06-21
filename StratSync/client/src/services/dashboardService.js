import axios from 'axios';

// Usar variable de entorno para la URL base
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/dashboard`;

export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    throw new Error(
      error.response?.data?.error || 
      'Error al cargar datos del dashboard. Intente nuevamente.'
    );
  }
};