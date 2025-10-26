// src/pages/private/SubjectsPage.jsx
import React, { useEffect, useState } from 'react';
import '../../assets/styles/subjects.css';
import { useCategories } from '../../context/CategoriesContext';
import axios from 'axios';

const SubjectsPage = () => {
  const { categories } = useCategories();
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    codigo: '',
    descripcion: '',
    categoria_id: ''
  });

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('/api/subjects');
      setSubjects(res.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
      alert('Error al cargar las materias');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...data } = formData;

    try {
      if (id) {
        await axios.put(`/api/subjects/${id}`, data);
        alert('Materia actualizada correctamente');
      } else {
        await axios.post('/api/subjects', data);
        alert('Materia creada correctamente');
      }

      setFormData({ id: null, nombre: '', codigo: '', descripcion: '', categoria_id: '' });
      fetchSubjects();
    } catch (error) {
      console.error('Error al guardar materia:', error);
      alert('Ocurrió un error al guardar la materia');
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      id: subject.id,
      nombre: subject.nombre,
      codigo: subject.codigo,
      descripcion: subject.descripcion,
      categoria_id: subject.categoria_id || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta materia?')) {
      try {
        await axios.delete(`/api/subjects/${id}`);
        alert('Materia eliminada correctamente');
        fetchSubjects();
      } catch (error) {
        console.error('Error al eliminar materia:', error);
        alert('Ocurrió un error al eliminar la materia');
      }
    }
  };

  const subjectsByCategory = (categoryId) =>
    subjects.filter((s) => s.categoria_id === categoryId);

  const uncategorized = subjects.filter((s) => !s.categoria_id);

  return (
<<<<<<< HEAD
    <div className="subjects-container">
      <h2>Gestión de Materias</h2>
=======
    <MainLayout>
      <div className="subjects-container" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <h1>StratSync - Gestión de Materias</h1>
        
        <div className="main-content">
          {/* Menú lateral de categorías */}
          <div className="categories-sidebar">
            <h2>Categorías</h2>
            <ul>
              {categories.map(category => (
                <li 
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubjects([]);
                  }}
                >
                  {category === 'Todos' && <FaList className="category-icon" />}
                  {category === 'Sin asignar' && <FaQuestionCircle className="category-icon" />}
                  {category}
                  
                  {/* Botón para eliminar categoría */}
                  {!['Todos', 'Sin asignar'].includes(category) && (
                    <button 
                      className="delete-category-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category);
                      }}
                    >
                      <FaTimes />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Formulario para nueva categoría */}
            {showCategoryForm ? (
              <div className="add-category-form">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nombre de categoría"
                  className="category-input"
                />
                <div className="category-form-actions">
                  <button 
                    onClick={handleAddCategory}
                    className="confirm-add-category"
                  >
                    <FaCheck /> Añadir
                  </button>
                  <button 
                    onClick={() => setShowCategoryForm(false)}
                    className="cancel-add-category"
                  >
                    <FaTimes /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="add-category-btn"
                onClick={() => setShowCategoryForm(true)}
              >
                <FaPlus /> Nueva categoría
              </button>
            )}
          </div>
>>>>>>> feature/dashboard-teacher

      <form className="subject-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="codigo"
          placeholder="Código"
          value={formData.codigo}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleInputChange}
        />
        <select
          name="categoria_id"
          value={formData.categoria_id}
          onChange={handleInputChange}
        >
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        <button type="submit">
          {formData.id ? 'Actualizar Materia' : 'Crear Materia'}
        </button>
      </form>

      {categories.map((cat) => (
        <div key={cat.id} className="category-section">
          <h3>{cat.nombre}</h3>
          <ul className="subject-list">
            {subjectsByCategory(cat.id).map((subject) => (
              <li key={subject.id} className="subject-item">
                <strong>{subject.nombre}</strong> ({subject.codigo})
                <p>{subject.descripcion}</p>
                <div className="subject-actions">
                  <button onClick={() => handleEdit(subject)}>Editar</button>
                  <button onClick={() => handleDelete(subject.id)}>Borrar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {uncategorized.length > 0 && (
        <div className="category-section">
          <h3>Sin Categoría</h3>
          <ul className="subject-list">
            {uncategorized.map((subject) => (
              <li key={subject.id} className="subject-item">
                <strong>{subject.nombre}</strong> ({subject.codigo})
                <p>{subject.descripcion}</p>
                <div className="subject-actions">
                  <button onClick={() => handleEdit(subject)}>Editar</button>
                  <button onClick={() => handleDelete(subject.id)}>Borrar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
