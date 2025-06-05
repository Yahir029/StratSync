import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { 
  FaUser, 
  FaCheck, 
  FaPlus, 
  FaTimes, 
  FaPhone, 
  FaEnvelope, 
  FaInfoCircle,
  FaList,
  FaQuestionCircle,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import '../../assets/styles/teachers.css';

const TeachersPage = () => {
  const { categories, dynamicCategories } = useCategories();

  const initialTeachersData = {
    'Idiomas': [
      { 
        id: 1, 
        firstName: 'John', 
        lastName: 'Smith', 
        email: 'john.smith@example.com',
        phone: '+1 555-123-4567',
        bio: 'Profesor de inglés con 10 años de experiencia en enseñanza a adultos',
        photoPreview: null,
        category: 'Idiomas'
      }
    ],
    'Matemáticas': [
      { 
        id: 2, 
        firstName: 'Carlos', 
        lastName: 'Gómez', 
        email: 'c.gomez@example.com',
        phone: '+52 55-1234-5678',
        bio: 'Especialista en matemáticas avanzadas y métodos de enseñanza',
        photoPreview: null,
        category: 'Matemáticas'
      }
    ],
    'Sin asignar': [
      {
        id: 100,
        firstName: 'Profesor',
        lastName: 'Sin asignar',
        email: '',
        phone: '',
        birthDate: '',
        educationLevel: '',
        specialty: '',
        yearsExperience: '',
        bio: 'Profesor sin categoría asignada',
        photoPreview: null,
        category: 'Sin asignar'
      }
    ]
  };

  const [teachersData, setTeachersData] = useState(initialTeachersData);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacherId, setCurrentTeacherId] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    educationLevel: '',
    specialty: '',
    yearsExperience: '',
    bio: '',
    photo: null,
    preview: null,
    category: 'Sin asignar'
  });

  const getTeachersByCategory = () => {
    if (selectedCategory === 'Todos') {
      return Object.values(teachersData).flat();
    } else {
      return teachersData[selectedCategory] || [];
    }
  };

  const toggleTeacherSelection = (teacherId) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId) 
        : [...prev, teacherId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTeacher(prev => ({
          ...prev,
          photo: file,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      setTeachersData(prev => {
        const updatedData = { ...prev };
        const oldCategory = Object.keys(updatedData).find(cat =>
          updatedData[cat].some(t => t.id === currentTeacherId)
        );

        if (oldCategory !== newTeacher.category) {
          updatedData[oldCategory] = updatedData[oldCategory].filter(
            t => t.id !== currentTeacherId
          );
        }

        const updatedTeacher = {
          id: currentTeacherId,
          firstName: newTeacher.firstName,
          lastName: newTeacher.lastName,
          email: newTeacher.email,
          phone: newTeacher.phone,
          birthDate: newTeacher.birthDate,
          educationLevel: newTeacher.educationLevel,
          specialty: newTeacher.specialty,
          yearsExperience: newTeacher.yearsExperience,
          bio: newTeacher.bio,
          photoPreview: newTeacher.preview,
          category: newTeacher.category || 'Sin asignar'
        };

        updatedData[newTeacher.category] = [
          ...(updatedData[newTeacher.category] || []).filter(t => t.id !== currentTeacherId),
          updatedTeacher
        ];

        return updatedData;
      });

      setIsEditing(false);
      setCurrentTeacherId(null);
    } else {
      const newId = Math.max(...Object.values(teachersData).flat().map(t => t.id), 0) + 1;

      const teacherToAdd = {
        id: newId,
        firstName: newTeacher.firstName,
        lastName: newTeacher.lastName,
        email: newTeacher.email,
        phone: newTeacher.phone,
        birthDate: newTeacher.birthDate,
        educationLevel: newTeacher.educationLevel,
        specialty: newTeacher.specialty,
        yearsExperience: newTeacher.yearsExperience,
        bio: newTeacher.bio,
        photoPreview: newTeacher.preview,
        category: newTeacher.category || 'Sin asignar'
      };

      const category = teacherToAdd.category;
      setTeachersData(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), teacherToAdd]
      }));
    }

    setNewTeacher({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      educationLevel: '',
      specialty: '',
      yearsExperience: '',
      bio: '',
      photo: null,
      preview: null,
      category: 'Sin asignar'
    });
    setShowForm(false);
  };

  const prepareEditForm = (teacher) => {
    setNewTeacher({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      birthDate: teacher.birthDate,
      educationLevel: teacher.educationLevel,
      specialty: teacher.specialty,
      yearsExperience: teacher.yearsExperience,
      bio: teacher.bio,
      photo: null,
      preview: teacher.photoPreview,
      category: teacher.category
    });
    setCurrentTeacherId(teacher.id);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <MainLayout>
      <div className="teachers-container">
        <h1>StratSync - Gestión de Profesores</h1>
        <div className="main-content">
          <div className="categories-sidebar">
            <h2>Categorías</h2>
            <ul>
              {categories.map(category => (
                <li 
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedTeachers([]);
                  }}
                >
                  {category === 'Todos' && <FaList className="category-icon" />}
                  {category === 'Sin asignar' && <FaQuestionCircle className="category-icon" />}
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="teachers-content">
            <div className="teachers-header">
              <h2>Profesores - {selectedCategory}</h2>
              <div className="teachers-actions">
                <button 
                  className="add-teacher-btn"
                  onClick={() => {
                    setShowForm(true);
                    setIsEditing(false);
                    setCurrentTeacherId(null);
                  }}
                >
                  <FaPlus /> Nuevo Profesor
                </button>
                {selectedTeachers.length > 0 && (
                  <div className="selection-actions">
                    {selectedTeachers.length === 1 && (
                      <button 
                        className="edit-teacher-btn"
                        onClick={() => {
                          const teacherToEdit = getTeachersByCategory()
                            .find(t => t.id === selectedTeachers[0]);
                          prepareEditForm(teacherToEdit);
                        }}
                      >
                        <FaEdit /> Editar
                      </button>
                    )}
                    <button 
                      className="delete-teacher-btn"
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar ${selectedTeachers.length > 1 ?
                          'los profesores seleccionados' : 'este profesor'}?`)) {
                          setTeachersData(prev => {
                            const newData = { ...prev };
                            Object.keys(newData).forEach(category => {
                              newData[category] = newData[category]
                                .filter(teacher => !selectedTeachers.includes(teacher.id));
                            });
                            return newData;
                          });
                          setSelectedTeachers([]);
                        }
                      }}
                    >
                      <FaTrash /> Borrar {selectedTeachers.length > 1 && `(${selectedTeachers.length})`}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="teachers-grid">
              {getTeachersByCategory().map(teacher => (
                <div 
                  key={teacher.id}
                  className={`teacher-card ${selectedTeachers.includes(teacher.id) ? 'selected' : ''}`}
                  onClick={() => toggleTeacherSelection(teacher.id)}
                >
                  <div className="teacher-oval">
                    {teacher.photoPreview ? (
                      <img 
                        src={teacher.photoPreview} 
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                        className="teacher-photo"
                      />
                    ) : (
                      <FaUser className="teacher-icon" />
                    )}
                    {selectedTeachers.includes(teacher.id) && (
                      <div className="selection-badge">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                  <div className="teacher-info">
                    <h4>{teacher.firstName} {teacher.lastName}</h4>
                    {teacher.bio && (
                      <div className="teacher-bio">
                        <FaInfoCircle /> {teacher.bio}
                      </div>
                    )}
                    <div className="teacher-contact">
                      {teacher.email && (
                        <p><FaEnvelope /> {teacher.email}</p>
                      )}
                      {teacher.phone && (
                        <p><FaPhone /> {teacher.phone}</p>
                      )}
                    </div>
                    {teacher.category === 'Sin asignar' && (
                      <div className="unassigned-badge">
                        Sin categoría asignada
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{isEditing ? 'Editar Profesor' : 'Registrar Nuevo Profesor'}</h3>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                    setCurrentTeacherId(null);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="form-scroll-container">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre(s)</label>
                      <input
                        type="text"
                        name="firstName"
                        value={newTeacher.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej. Juan"
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellidos</label>
                      <input
                        type="text"
                        name="lastName"
                        value={newTeacher.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej. Pérez García"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaEnvelope /> Correo Electrónico</label>
                      <input
                        type="email"
                        name="email"
                        value={newTeacher.email}
                        onChange={handleInputChange}
                        required
                        placeholder="ejemplo@dominio.com"
                      />
                    </div>
                    <div className="form-group">
                      <label><FaPhone /> Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={newTeacher.phone}
                        onChange={handleInputChange}
                        placeholder="+52 55-1234-5678"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Código de Identificación</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        name="code"
                        value={newTeacher.code || ''}
                        readOnly
                        placeholder="Genera un código"
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
                          setNewTeacher(prev => ({ ...prev, code: randomCode }));
                        }}
                        className="generate-btn"
                      >
                        Generar
                      </button>
                    </div>
                  </div>    

                  <div className="form-group">
                    <label>Categoría</label>
                    <select
                      name="category"
                      value={newTeacher.category}
                      onChange={handleInputChange}
                    > 
                      {dynamicCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="Sin asignar">Sin asignar</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Biografía/Resumen Profesional</label>
                    <textarea
                      name="bio"
                      value={newTeacher.bio}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Breve descripción profesional..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Foto de Perfil</label>
                    <div className="photo-upload">
                      {newTeacher.preview ? (
                        <div className="photo-preview">
                          <img 
                            src={newTeacher.preview} 
                            alt="Vista previa" 
                            className="preview-image"
                          />
                          <button 
                            type="button"
                            className="change-photo-btn"
                            onClick={() => setNewTeacher(prev => ({ ...prev, photo: null, preview: null }))}
                          >
                            Cambiar foto
                          </button>
                        </div>
                      ) : (
                        <label className="upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input"
                          />
                          <span>Seleccionar imagen</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditing(false);
                        setCurrentTeacherId(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="submit-btn"
                    >
                      {isEditing ? 'Actualizar Profesor' : 'Registrar Profesor'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="footer">
          <p>StratSync v1.0</p>
          <p>Sistema de Gestión Académica Integral</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeachersPage;
