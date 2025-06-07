// subjectsService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subjects'; // Ajusta según tu endpoint

// Exportación CORRECTA (con llaves)
export const getAllSubjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};
