import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/horarios';

export const getAllSchedules = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener horarios');
  }
};

export const createSchedule = async (data) => {
  try {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear horario:', error);
    const errorMsg = error.response?.data?.error ||
                    error.response?.data?.message ||
                    'Error al crear horario';
    throw new Error(errorMsg);
  }
};

export const updateSchedule = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    const errorMsg = error.response?.data?.error ||
                    error.response?.data?.message ||
                    'Error al actualizar horario';
    throw new Error(errorMsg);
  }
};

export const deleteSchedule = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    const errorMsg = error.response?.data?.error ||
                    error.response?.data?.message ||
                    'Error al eliminar horario';
    throw new Error(errorMsg);
  }
};
