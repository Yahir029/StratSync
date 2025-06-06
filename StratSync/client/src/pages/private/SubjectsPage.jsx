import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../../components/layout/MainLayout';
import {
  FaBook, FaCheck, FaPlus, FaTimes, FaEdit, FaTrash, FaList, FaQuestionCircle
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import '../../assets/styles/subjects.css';

const SubjectsPage = () => {
  const { categories, addCategory, deleteCategory, dynamicCategories } = useCategories();

  useEffect(() => {
    console.log('Categorías disponibles para select:', dynamicCategories);
  }, [dynamicCategories]);

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

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/subjects');
        const subjects = res.data;

        const grouped = {
          'Sin asignar': [] // Inicializamos explícitamente la categoría "Sin asignar"
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
        console.error('Error al cargar materias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

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
        await axios.put(`http://localhost:5000/api/subjects/${currentSubjectId}`, {
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

        alert('Materia actualizada correctamente');
      } else {
        const res = await axios.post('http://localhost:5000/api/subjects', {
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

        alert('Materia creada correctamente');
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
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} la materia: ${err.response?.data?.message || err.message}`);
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
      }
    } catch (err) {
      setError('Error al agregar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    if (['Todos', 'Sin asignar'].includes(categoryToDelete)) return;

    if (window.confirm(`¿Eliminar la categoría "${categoryToDelete}"? Las materias serán movidas a "Sin asignar".`)) {
      try {
        setLoading(true);
        const categoryToDeleteObj = dynamicCategories.find(cat => cat.nombre === categoryToDelete);
        if (!categoryToDeleteObj) return;

        await deleteCategory(categoryToDeleteObj.id);

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
      } catch (err) {
        setError('Error al eliminar la categoría');
      } finally {
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
        await Promise.all(selectedSubjects.map(id =>
          axios.delete(`http://localhost:5000/api/subjects/${id}`)
        ));

        setSubjectsData(prev => {
          const newData = { ...prev };
          Object.keys(newData).forEach(category => {
            newData[category] = newData[category]
              .filter(subject => !selectedSubjects.includes(subject.id));
          });
          return newData;
        });

        setSelectedSubjects([]);
        alert('Materia(s) eliminada(s) correctamente');
      } catch (err) {
        setError('Error al eliminar materias');
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
              <p>Materias disponibles en esta categoría</p>

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

                {selectedSubjects.length > 0 && (
                  <div className="selection-actions">
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
                      <FaTrash /> Eliminar {selectedSubjects.length > 1 && `(${selectedSubjects.length})`}
                    </button>
                  </div>
                )}
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
