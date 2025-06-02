// src/context/CategoriesContext.js
import { createContext, useState, useContext } from 'react';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  // Categorías iniciales (puedes ajustarlas según necesites)
  const initialCategories = [
    'Idiomas',
    'Matemáticas',
    'Ciencias',
    'Humanidades',
    'Tecnología',
    'Artes'
  ];

  // Estado de las categorías (incluye 'Todos' y 'Sin asignar')
  const [categories, setCategories] = useState([
    'Todos',
    ...initialCategories,
    'Sin asignar'
  ]);

  // Función para añadir categoría
  const addCategory = (newCategory) => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev.slice(0, -1), newCategory.trim(), 'Sin asignar']);
      return true; // Indica que se añadió correctamente
    }
    return false; // Indica que no se pudo añadir
  };

  // Función para eliminar categoría
  const deleteCategory = (categoryToDelete) => {
    if (['Todos', 'Sin asignar'].includes(categoryToDelete)) return false;
    
    setCategories(prev => prev.filter(cat => cat !== categoryToDelete));
    return true; // Indica que se eliminó correctamente
  };

  return (
    <CategoriesContext.Provider 
      value={{ 
        categories, 
        addCategory, 
        deleteCategory,
        dynamicCategories: categories.filter(cat => !['Todos', 'Sin asignar'].includes(cat))
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);