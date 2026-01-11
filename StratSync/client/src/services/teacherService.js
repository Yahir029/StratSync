const API_URL = 'http://localhost:5000/api/teachers';

/**
 * Crea un nuevo profesor en el backend.
 * @param {Object} teacherData - Datos del profesor a crear.
 */
export const createTeacher = async (teacherData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teacherData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear el profesor');
  }

  return response.json();
};

/**
 * Obtiene todos los profesores desde el backend.
 */
// teacherService.js
export const getTeachers = async () => {
  const [teachersRes, categoriesRes] = await Promise.all([
    fetch(API_URL),
    fetch('http://localhost:5000/api/categories')
  ]);

  if (!teachersRes.ok || !categoriesRes.ok) {
    throw new Error('Error al obtener datos');
  }

  const [teachers, categories] = await Promise.all([
    teachersRes.json(),
    categoriesRes.json()
  ]);

  return teachers.map(teacher => ({
    ...teacher,
    categoria_nombre: categories.find(c => c.id === teacher.categoria_id)?.nombre || 'Sin asignar',
    categoria_completa: categories.find(c => c.id === teacher.categoria_id) // Opcional
  }));
};
/**
 * Actualiza un profesor por ID.
 * @param {number|string} id - ID del profesor a actualizar.
 * @param {Object} teacherData - Nuevos datos del profesor.
 */
export const updateTeacher = async (id, teacherData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teacherData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar el profesor');
  }

  return response.json();
};

/**
 * Elimina un profesor por ID.
 * @param {number|string} id - ID del profesor a eliminar.
 */
export const deleteTeacher = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar el profesor');
  }

  return response.json();
};
