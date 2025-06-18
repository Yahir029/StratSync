// subjectsService.js
import axios from 'axios';

// Usar variable de entorno para la URL base
const API_URL = `${process.env.REACT_APP_API_URL}/api/subjects`;

export const getAllSubjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};