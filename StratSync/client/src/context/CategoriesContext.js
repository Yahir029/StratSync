import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  // Aquí guardamos las categorías como objetos { id, nombre }
  const [categoriesObj, setCategoriesObj] = useState([]);
  // Estado de carga para evitar renderizados prematuros
  const [loading, setLoading] = useState(true);

  // -- 1) Fetch inicial de categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        // res.data viene como array de objetos { id, nombre }
        setCategoriesObj(res.data);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // -- 2) Función para crear una categoría nueva
  const addCategory = async (nombre) => {
    if (!nombre.trim()) return false;

    try {
      // Llamada al backend para crear
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/categories`,
        { nombre: nombre.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // res.data tiene el objeto creado: { id, nombre }
      setCategoriesObj((prev) => [...prev, res.data]);
      return true;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      return false;
    }
  };

  // -- 3) Función para eliminar una categoría dado su nombre
  const deleteCategory = async (nombre) => {
    // Buscamos el objeto con ese nombre para obtener el id
    const catToDelete = categoriesObj.find((c) => c.nombre === nombre);
    if (!catToDelete) return false;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/categories/${catToDelete.id}`
      );
      // Removemos del estado local
      setCategoriesObj((prev) => prev.filter((c) => c.id !== catToDelete.id));
      return true;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return false;
    }
  };

  // -- Derivados de solo nombres para consumo en componentes
  const categoryNames = ['Todos', ...categoriesObj.map((c) => c.nombre), 'Sin asignar'];
  const dynamicCategories = categoriesObj.map((c) => c.nombre);

  return (
    <CategoriesContext.Provider
      value={{
        // Si todavía está cargando, devolvemos solo lo mínimo
        categories: loading ? ['Todos', 'Sin asignar'] : categoryNames,
        dynamicCategories: loading ? [] : dynamicCategories,
        addCategory,
        deleteCategory,
        loading
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
