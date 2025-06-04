const API_URL = 'https://super-meme-4pxp65x4gw43jvjg-4000.app.github.dev/api/auth';

// Función mejorada para manejar solicitudes
const fetchWithRetry = async (endpoint, options, retries = 1) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, options);
    
    // Si hay un error de CORS
    if (response.type === 'opaque' || response.status === 0) {
      throw new Error('Error de conexión con el servidor (CORS)');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Reintentando ${endpoint}... (${retries} intentos restantes)`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchWithRetry(endpoint, options, retries - 1);
    }
    throw error;
  }
};

export const loginUser = (username) => {
  return fetchWithRetry('login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({ username }),
    credentials: 'include',
    mode: 'cors'
  });
};

export const loginAdmin = (username, password) => {
  return fetchWithRetry('admin-login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
    mode: 'cors'
  });
};