import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../../components/layout/MainLayout';
import {
  FaBook, FaCheck, FaPlus, FaTimes, FaEdit, FaTrash, FaList,
  FaQuestionCircle, FaCheckCircle
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import '../../assets/styles/subjects.css';

const SubjectsPage = () => {
  // Obtener la URL base desde las variables de entorno
  const API_BASE = process.env.REACT_APP_API_URL;

  const { categories, addCategory, deleteCategory, dynamicCategories } = useCategories();
  const [subjectsData, setSubjectsData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    description: '',
    categoria_id: null
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '' // 'success' o 'error'
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usar variable de entorno para la URL
        const res = await axios.get(`${API_BASE}/api/subjects`);
        const subjects = res.data;

        const grouped = {
          'Sin asignar': []
        };

        subjects.forEach(subject => {
          const hasCategory = subject.Categorium && subject.Categorium.nombre;
          const categoryName = hasCategory ? subject.Categorium.nombre : 'Sin asignar';

          if (!grouped[categoryName]) {
            grouped[categoryName] = [];
          }

          grouped[categoryName].push({
            id: subject.id,
            name: subject.nombre,
            code: subject.codigo,
            description: subject.descripcion,
            categoria: hasCategory ? subject.Categorium : null
          });
        });

        setSubjectsData(grouped);
      } catch (err) {
        setError('Error al cargar materias desde el servidor.');
        showNotification('Error al cargar materias', 'error');
        console.error('Error al cargar materias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [API_BASE]); // Añadir API_BASE como dependencia

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });

    // Ocultar después de 3 segundos
    setTimeout(() => {
      setNotification({
        show: false,
        message: '',
        type: ''
      });
    }, 3000);
  };

  const getSubjectsByCategory = () => {
    if (selectedCategory === 'Todos') {
      return Object.values(subjectsData).flat();
    } else {
      return subjectsData[selectedCategory] || [];
    }
  };

  const toggleSubjectSelection = (subjectId) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject(prev => ({
      ...prev,
      [name]: name === 'categoria_id' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        // Usar variable de entorno para la URL
        await axios.put(`${API_BASE}/api/subjects/${currentSubjectId}`, {
          nombre: newSubject.name,
          codigo: newSubject.code,
          descripcion: newSubject.description,
          categoria_id: newSubject.categoria_id
        });

        setSubjectsData(prev => {
          const updatedData = { ...prev };
          const oldCategoryName = Object.keys(updatedData).find(catName =>
            updatedData[catName].some(s => s.id === currentSubjectId)
          );

          const newCategory = dynamicCategories.find(cat => cat.id === newSubject.categoria_id);
          const newCategoryName = newCategory?.nombre || 'Sin asignar';

          if (oldCategoryName !== newCategoryName) {
            updatedData[oldCategoryName] = updatedData[oldCategoryName].filter(
              s => s.id !== currentSubjectId
            );
          }

          const updatedSubject = {
            id: currentSubjectId,
            name: newSubject.name,
            code: newSubject.code,
            description: newSubject.description,
            categoria: newCategory || null
          };

          updatedData[newCategoryName] = [
            ...(updatedData[newCategoryName] || []).filter(s => s.id !== currentSubjectId),
            updatedSubject
          ];

          return updatedData;
        });

        // Deseleccionar la materia editada
        setSelectedSubjects(prev => prev.filter(id => id !== currentSubjectId));
        
        showNotification(`Materia "${newSubject.name}" actualizada correctamente`);
      } else {
        // Usar variable de entorno para la URL
        const res = await axios.post(`${API_BASE}/api/subjects`, {
          nombre: newSubject.name,
          codigo: newSubject.code,
          descripcion: newSubject.description,
          categoria_id: newSubject.categoria_id
        });

        const created = res.data;
        const category = dynamicCategories.find(cat => cat.id === newSubject.categoria_id);
        const categoryName = category?.nombre || 'Sin asignar';

        const subjectToAdd = {
          id: created.id,
          name: created.nombre,
          code: created.codigo,
          description: created.descripcion,
          categoria: category || null
        };

        setSubjectsData(prev => ({
          ...prev,
          [categoryName]: [
            ...(prev[categoryName] || []),
            subjectToAdd
          ]
        }));

        // Deseleccionar todas las materias al crear una nueva
        setSelectedSubjects([]);
        
        showNotification(`Materia "${newSubject.name}" creada correctamente`);
      }

      setNewSubject({
        name: '',
        code: '',
        description: '',
        categoria_id: null
      });
      setShowForm(false);
      setIsEditing(false);
      setCurrentSubjectId(null);
    } catch (err) {
      const errorMsg = `Error al ${isEditing ? 'actualizar' : 'crear'} la materia: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setLoading(true);
      const success = await addCategory(newCategoryName.trim());
      if (success) {
        setNewCategoryName('');
        setShowCategoryForm(false);
        showNotification(`Categoría "${newCategoryName}" agregada`);
      }
    } catch (err) {
      setError('Error al agregar la categoría');
      showNotification('Error al agregar la categoría', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
  if (['Todos', 'Sin asignar'].includes(categoryToDelete)) return;

  const categoryToDeleteObj = dynamicCategories.find(cat => cat.nombre === categoryToDelete);
  if (!categoryToDeleteObj) return;

  if (window.confirm(`¿Eliminar la categoría "${categoryToDelete}"? Las materias serán movidas a "Sin asignar".`)) {
    try {
      setLoading(true);
      // Pasar el ID de la categoría
      await deleteCategory(categoryToDeleteObj.id);

      // Actualizar las materias
      setSubjectsData(prev => {
        const updatedData = { ...prev };
        const subjectsToMove = updatedData[categoryToDelete] || [];
        
        updatedData['Sin asignar'] = [
          ...(updatedData['Sin asignar'] || []),
          ...subjectsToMove.map(subject => ({
            ...subject,
            categoria: null
          }))
        ];
        
        delete updatedData[categoryToDelete];
        return updatedData;
      });

      // Mostrar notificación y detener carga
      showNotification(`Categoría "${categoryToDelete}" eliminada`);
      setLoading(false);
    } catch (err) {
      setError('Error al eliminar la categoría');
      showNotification('Error al eliminar la categoría', 'error');
      setLoading(false);
    }
  }
};

  const prepareEditForm = (subject) => {
    setNewSubject({
      name: subject.name,
      code: subject.code,
      description: subject.description,
      categoria_id: subject.categoria?.id || null
    });
    setCurrentSubjectId(subject.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteSubjects = async () => {
    if (selectedSubjects.length === 0) return;

    if (window.confirm(`¿Eliminar ${selectedSubjects.length > 1 ?
      'las materias seleccionadas' : 'esta materia'}?`)) {
      try {
        setLoading(true);
        // Usar variable de entorno para la URL
        await Promise.all(selectedSubjects.map(id =>
          axios.delete(`${API_BASE}/api/subjects/${id}`)
        ));

        setSubjectsData(prev => {
          const newData = { ...prev };
          Object.keys(newData).forEach(category => {
            newData[category] = newData[category]
              .filter(subject => !selectedSubjects.includes(subject.id));
          });
          return newData;
        });

        // Deseleccionar todas las materias después de eliminar
        setSelectedSubjects([]);
        
        showNotification(
          selectedSubjects.length > 1
            ? 'Materias eliminadas correctamente'
            : 'Materia eliminada correctamente'
        );
      } catch (err) {
        setError('Error al eliminar materias');
        showNotification('Error al eliminar materias', 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <p>Cargando...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Reintentar</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* Notificación flotante */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <FaCheckCircle className="notification-icon" />
          <span>{notification.message}</span>
        </div>
      )}
      
      <div className="subjects-container">
        <h1>StratSync - Gestión de Materias</h1>

        <div className="main-content">
          {/* Sidebar de categorías */}
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
                    disabled={!newCategoryName.trim()}
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

          {/* Contenido de materias */}
          <div className="subjects-content">
            <div className="subjects-header">
              <h2>{selectedCategory}</h2>

              <div className="subjects-actions">
                <button
                  className="add-subject-btn"
                  onClick={() => {
                    setShowForm(true);
                    setIsEditing(false);
                    setCurrentSubjectId(null);
                  }}
                >
                  <FaPlus /> Nueva Materia
                </button>
              </div>
            </div>

            <div className="subjects-grid">
              {getSubjectsByCategory().map(subject => (
                <div
                  key={subject.id}
                  className={`subject-card ${selectedSubjects.includes(subject.id) ? 'selected' : ''}`}
                  onClick={() => toggleSubjectSelection(subject.id)}
                >
                  <div className="subject-icon-container">
                    <FaBook className="subject-icon" />
                    {selectedSubjects.includes(subject.id) && (
                      <div className="selection-badge">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                  <div className="subject-info">
                    <h3>{subject.name}</h3>
                    <p className="subject-code">{subject.code}</p>
                    {subject.description && (
                      <p className="subject-description">{subject.description}</p>
                    )}
                    <div className="subject-category">
                      {subject.categoria ? (
                        <span className="category-badge">{subject.categoria.nombre}</span>
                      ) : (
                        <span className="unassigned-badge">Sin categoría asignada</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {getSubjectsByCategory().length === 0 && (
                <div className="no-subjects">
                  <p>No hay materias en esta categoría</p>
                  <button
                    className="add-subject-btn"
                    onClick={() => setShowForm(true)}
                  >
                    <FaPlus /> Agregar primera materia
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botones flotantes para acciones con selección múltiple */}
        {selectedSubjects.length > 0 && (
          <div className="sticky-actions">
            {selectedSubjects.length === 1 && (
              <button
                className="edit-subject-btn"
                onClick={() => {
                  const subjectToEdit = getSubjectsByCategory()
                    .find(s => s.id === selectedSubjects[0]);
                  prepareEditForm(subjectToEdit);
                }}
              >
                <FaEdit /> Editar
              </button>
            )}
            <button
              className="delete-subject-btn"
              onClick={handleDeleteSubjects}
            >
              <FaTrash /> {selectedSubjects.length === 1 ? 'Eliminar' : `Eliminar (${selectedSubjects.length})`}
            </button>
          </div>
        )}

        {/* Formulario modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{isEditing ? 'Editar Materia' : 'Nueva Materia'}</h3>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                    setCurrentSubjectId(null);
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="form-scroll-container">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="name"
                        value={newSubject.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: Álgebra Lineal"
                      />
                    </div>
                    <div className="form-group">
                      <label>Código</label>
                      <input
                        type="text"
                        name="code"
                        value={newSubject.code}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: ALG-201"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      name="description"
                      value={newSubject.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Descripción de la materia..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Categoría</label>
                    <select
                      name="categoria_id"
                      value={newSubject.categoria_id || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Sin categoría</option>
                      {dynamicCategories?.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      <FaCheck /> {isEditing ? 'Guardar Cambios' : 'Crear Materia'}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditing(false);
                        setCurrentSubjectId(null);
                      }}
                    >
                      <FaTimes /> Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SubjectsPage;