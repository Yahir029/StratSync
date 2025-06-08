import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { 
  FaBook, 
  FaCheck, 
  FaPlus, 
  FaTimes, 
  FaEdit, 
  FaTrash,
  FaList,
  FaQuestionCircle
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import '../../assets/styles/subjects.css';

const SubjectsPage = () => {
  // Obtener categorías del contexto
  const { categories, addCategory, deleteCategory, dynamicCategories } = useCategories();

  // Datos iniciales de materias
  const initialSubjectsData = {
    'Idiomas': [
      { id: 1, name: 'Inglés', code: 'ENG-101', description: 'Curso básico de inglés', category: 'Idiomas' },
      { id: 2, name: 'Francés', code: 'FRA-101', description: 'Introducción al francés', category: 'Idiomas' }
    ],
    'Matemáticas': [
      { id: 3, name: 'Álgebra', code: 'ALG-201', description: 'Álgebra lineal básica', category: 'Matemáticas' },
      { id: 4, name: 'Geometría', code: 'GEO-202', description: 'Geometría euclidiana', category: 'Matemáticas' }
    ],
    'Sin asignar': [
      { id: 5, name: 'Programación', code: 'PRO-301', description: 'Fundamentos de programación', category: 'Sin asignar' }
    ]
  };

  // Estados
  const [subjectsData, setSubjectsData] = useState(initialSubjectsData);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    description: '',
    category: 'Sin asignar'
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Obtener materias según categoría seleccionada
  const getSubjectsByCategory = () => {
    if (selectedCategory === 'Todos') {
      return Object.values(subjectsData).flat();
    } else {
      return subjectsData[selectedCategory] || [];
    }
  };

  // Toggle subject selection
  const toggleSubjectSelection = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId) 
        : [...prev, subjectId]
    );
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject(prev => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Editar materia existente
      setSubjectsData(prev => {
        const updatedData = {...prev};
        const oldCategory = Object.keys(updatedData).find(cat => 
          updatedData[cat].some(s => s.id === currentSubjectId)
        );
        
        if (oldCategory !== newSubject.category) {
          // Mover a nueva categoría
          updatedData[oldCategory] = updatedData[oldCategory].filter(
            s => s.id !== currentSubjectId
          );
        }
        
        // Actualizar materia
        const updatedSubject = {
          id: currentSubjectId,
          name: newSubject.name,
          code: newSubject.code,
          description: newSubject.description,
          category: newSubject.category
        };
        
        updatedData[newSubject.category] = [
          ...(updatedData[newSubject.category] || []).filter(s => s.id !== currentSubjectId),
          updatedSubject
        ];
        
        return updatedData;
      });
      
      setIsEditing(false);
      setCurrentSubjectId(null);
    } else {
      // Agregar nueva materia
      const newId = Math.max(...Object.values(subjectsData).flat().map(s => s.id), 0) + 1;
      
      const subjectToAdd = {
        id: newId,
        name: newSubject.name,
        code: newSubject.code,
        description: newSubject.description,
        category: newSubject.category
      };

      // Agregar a categoría correspondiente
      setSubjectsData(prev => ({
        ...prev,
        [subjectToAdd.category]: [...(prev[subjectToAdd.category] || []), subjectToAdd]
      }));
    }

    // Reset form
    setNewSubject({
      name: '',
      code: '',
      description: '',
      category: 'Sin asignar'
    });
    setShowForm(false);
  };

  // Manejar creación de nueva categoría
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const success = addCategory(newCategoryName.trim());
      if (success) {
        setNewCategoryName('');
        setShowCategoryForm(false);
      }
    }
  };

  // Manejar eliminación de categoría
  const handleDeleteCategory = (categoryToDelete) => {
    if (['Todos', 'Sin asignar'].includes(categoryToDelete)) return;
    
    if (window.confirm(`¿Eliminar la categoría "${categoryToDelete}"? Las materias serán movidas a "Sin asignar".`)) {
      // Mover materias a "Sin asignar"
      setSubjectsData(prev => {
        const updatedData = {...prev};
        const subjectsToMove = updatedData[categoryToDelete] || [];
        
        updatedData['Sin asignar'] = [
          ...(updatedData['Sin asignar'] || []),
          ...subjectsToMove.map(subject => ({
            ...subject,
            category: 'Sin asignar'
          }))
        ];
        
        delete updatedData[categoryToDelete];
        return updatedData;
      });
      
      // Eliminar categoría del contexto
      deleteCategory(categoryToDelete);
    }
  };

  // Preparar formulario para edición
  const prepareEditForm = (subject) => {
    setNewSubject({
      name: subject.name,
      code: subject.code,
      description: subject.description,
      category: subject.category
    });
    setCurrentSubjectId(subject.id);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
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

          {/* Contenido principal */}
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
                
                {/* Botones de acción para selección múltiple */}
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
                      onClick={() => {
                        if(window.confirm(`¿Eliminar ${selectedSubjects.length > 1 ? 
                          'las materias seleccionadas' : 'esta materia'}?`)) {
                          setSubjectsData(prev => {
                            const newData = {...prev};
                            Object.keys(newData).forEach(category => {
                              newData[category] = newData[category]
                                .filter(subject => !selectedSubjects.includes(subject.id));
                            });
                            return newData;
                          });
                          setSelectedSubjects([]);
                        }
                      }}
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
                    {subject.category === 'Sin asignar' && (
                      <div className="unassigned-badge">
                        Sin categoría asignada
                      </div>
                    )}
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

        {/* Modal de formulario */}
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
                    <label>Categoría</label>
                    <select
                      name="category"
                      value={newSubject.category}
                      onChange={handleInputChange}
                      required
                    >
                      {dynamicCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="Sin asignar">Sin asignar</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      name="description"
                      value={newSubject.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Descripción de la materia..."
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditing(false);
                        setCurrentSubjectId(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="submit-btn"
                    >
                      {isEditing ? 'Actualizar' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="footer">
          <p>StratSync v1.0</p>
          <p>Sistema de Gestión Académica</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubjectsPage;