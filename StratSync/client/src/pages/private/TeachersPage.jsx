import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import {
  FaUser, FaCheck, FaPlus, FaTimes, FaPhone, FaEnvelope, FaInfoCircle,
  FaList, FaQuestionCircle, FaEdit, FaTrash, FaCheckCircle
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import {
  getTeachers, createTeacher, updateTeacher, deleteTeacher
} from '../../services/teacherService';
import '../../assets/styles/teachers.css';

const TeachersPage = () => {
  // --- Estados ---
  const [teachers, setTeachers] = useState([]);
  const [teachersByCategory, setTeachersByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '' // 'success' o 'error'
  });

  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    category: '',
    code: '',
    photo: null,
    preview: null,
  });

  const { dynamicCategories } = useCategories();

  // Función para mostrar notificaciones
  const showNotification = useCallback((message, type = 'success') => {
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
  }, []);

  // --- Funciones principales ---
  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeachers();

      // Agrupar por categoría para la vista
      const agrupados = data.reduce((acc, t) => {
        const cat = t.categoria ? t.categoria.nombre : 'Sin asignar';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(t);
        return acc;
      }, {});

      setTeachersByCategory(agrupados);
      setTeachers(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando profesores:', err);
      setError(err.message);
      showNotification('Error cargando profesores', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // --- Efectos ---
  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const getTeachersByCategory = () => {
    if (selectedCategory === 'Todos') {
      return teachers;
    }
    return teachersByCategory[selectedCategory] || [];
  };

  // --- Manejo de selección ---
  const toggleTeacherSelection = (id) => {
    setSelectedTeachers(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  // --- Operaciones CRUD ---
  const prepareEditForm = useCallback((teacher) => {
    setNewTeacher({
      firstName: teacher.nombres || '',
      lastName: teacher.apellidos || '',
      email: teacher.correo || '',
      phone: teacher.telefono || '',
      bio: teacher.biografia || '',
      category: teacher.categoria_id ? teacher.categoria_id.toString() : '',
      code: teacher.codigo_acceso_maestro || '',
      photo: null,
      preview: teacher.foto_perfil
        ? `data:image/*;base64,${teacher.foto_perfil}`
        : null,
    });
    setEditingTeacherId(teacher.id);
    setIsEditing(true);
    setShowForm(true);
  }, []);

  const handleEditSelected = () => {
    if (selectedTeachers.length === 1) {
      const teacher = teachers.find(t => t.id === selectedTeachers[0]);
      if (teacher) prepareEditForm(teacher);
    }
  };

  const deleteSelectedTeachers = async () => {
    if (!selectedTeachers.length) return;

    const confirmMessage = selectedTeachers.length > 1
      ? `¿Eliminar ${selectedTeachers.length} profesores seleccionados?`
      : '¿Eliminar este profesor?';

    if (!window.confirm(confirmMessage)) return;

    try {
      await Promise.all(selectedTeachers.map(id => deleteTeacher(id)));
      await loadTeachers();
      
      // Deseleccionar todos los profesores después de eliminar
      setSelectedTeachers([]);
      
      showNotification(
        `${selectedTeachers.length > 1 ? 'Profesores eliminados' : 'Profesor eliminado'} correctamente`
      );
    } catch (err) {
      console.error('Error al eliminar:', err);
      setError('Error al eliminar: ' + err.message);
      showNotification('Error al eliminar profesor(es)', 'error');
    }
  };

  // --- Manejo del formulario ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewTeacher(prev => ({
        ...prev,
        photo: file,
        preview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const generateRandomCode = () => {
    // Función para generar una parte del código (4 caracteres)
    const generatePart = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let part = '';

      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        part += characters[randomIndex];
      }

      return part;
    };

    // Generar dos partes y unirlas con un guión
    const part1 = generatePart();
    const part2 = generatePart();
    const code = `${part1}-${part2}`;

    setNewTeacher(prev => ({ ...prev, code: code }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar payload para el backend
    const payload = {
      nombres: newTeacher.firstName,
      apellidos: newTeacher.lastName,
      correo: newTeacher.email,
      telefono: newTeacher.phone,
      biografia: newTeacher.bio,
      categoria_id: newTeacher.category ? parseInt(newTeacher.category) : null,
      codigo_acceso_maestro: newTeacher.code,
      creado_por: 1,
    };

    try {
      if (isEditing && editingTeacherId) {
        const updatedTeacher = await updateTeacher(editingTeacherId, payload);

        // Deseleccionar el profesor editado
        setSelectedTeachers(prev => 
          prev.filter(id => id !== editingTeacherId)
        );
        
        showNotification(
          `Profesor ${updatedTeacher.nombres} ${updatedTeacher.apellidos} actualizado correctamente`
        );
      } else {
        const newTeacherData = await createTeacher(payload);
        
        // Deseleccionar todos los profesores al crear uno nuevo
        setSelectedTeachers([]);
        
        showNotification(
          `Profesor ${newTeacherData.nombres} ${newTeacherData.apellidos} creado correctamente`
        );
      }

      resetForm();
      await loadTeachers();
    } catch (err) {
      console.error('Error al guardar:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Error desconocido';
      showNotification(`Error: ${errorMsg}`, 'error');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingTeacherId(null);
    setNewTeacher({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      category: '',
      code: '',
      photo: null,
      preview: null,
    });
  };

  // --- Renderizado ---
  if (loading) {
    return (
      <MainLayout>
        <div className="teachers-container">
          <p>Cargando profesores...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="teachers-container">
          <p className="error-message">Error: {error}</p>
          <button className="retry-btn" onClick={loadTeachers}>Reintentar</button>
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
      
      <div className="teachers-container">
        <h1>StratSync - Gestión de Profesores</h1>

        <div className="main-content">
          {/* Sidebar de categorías */}
          <div className="categories-sidebar">
            <h2>Categorías</h2>
            <ul>
              {/* Item "Todos" fijo */}
              <li
                className={selectedCategory === 'Todos' ? 'active' : ''}
                onClick={() => setSelectedCategory('Todos')}
              >
                <FaList className="category-icon" /> Todos
              </li>

              {/* Categorías principales */}
              {dynamicCategories
                .filter(cat => cat.nombre !== 'Todos' && cat.nombre !== 'Sin asignar')
                .map(cat => (
                  <li
                    key={cat.id}
                    className={selectedCategory === cat.nombre ? 'active' : ''}
                    onClick={() => setSelectedCategory(cat.nombre)}
                  >
                    {cat.nombre}
                  </li>
                ))}

              {/* Item "Sin asignar" único */}
              <li
                className={selectedCategory === 'Sin asignar' ? 'active' : ''}
                onClick={() => setSelectedCategory('Sin asignar')}
              >
                <FaQuestionCircle className="category-icon" /> Sin asignar
              </li>
            </ul>
          </div>

          {/* Contenido principal */}
          <div className="teachers-content">
            <div className="teachers-header">
              <h2>Profesores - {selectedCategory}</h2>
              <div className="teachers-actions">
                <button
                  className="add-teacher-btn"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                >
                  <FaPlus /> Nuevo Profesor
                </button>
              </div>
            </div>

            {/* Grid de profesores */}
            <div className="teachers-grid">
              {getTeachersByCategory().map(teacher => (
                <div
                  key={teacher.id}
                  className={`teacher-card ${selectedTeachers.includes(teacher.id) ? 'selected' : ''}`}
                  onClick={() => toggleTeacherSelection(teacher.id)}
                >
                  <div className="teacher-oval">
                    {teacher.foto_perfil ? (
                      <img
                        src={`data:image/*;base64,${teacher.foto_perfil}`}
                        alt={`${teacher.nombres} ${teacher.apellidos}`}
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
                    <h4>{teacher.nombres} {teacher.apellidos}</h4>
                    {teacher.biografia && (
                      <div className="teacher-bio">
                        <FaInfoCircle /> {teacher.biografia}
                      </div>
                    )}
                    <div className="teacher-contact">
                      {teacher.correo && (
                        <p>
                          <FaEnvelope /> {teacher.correo}
                        </p>
                      )}
                      {teacher.telefono && (
                        <p>
                          <FaPhone /> {teacher.telefono}
                        </p>
                      )}
                    </div>
                    {!teacher.categoria && (
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

        {/* Acciones flotantes para selección múltiple */}
        {selectedTeachers.length > 0 && (
          <div className="sticky-actions">
            {selectedTeachers.length === 1 && (
              <button className="edit-teacher-btn" onClick={handleEditSelected}>
                <FaEdit /> Editar
              </button>
            )}
            <button className="delete-teacher-btn" onClick={deleteSelectedTeachers}>
              <FaTrash /> {selectedTeachers.length === 1 ? 'Borrar' : `Borrar (${selectedTeachers.length})`}
            </button>
          </div>
        )}

        {/* Modal de formulario */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{isEditing ? 'Editar Profesor' : 'Registrar Nuevo Profesor'}</h3>
                <button className="close-btn" onClick={resetForm}>
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
                        onClick={generateRandomCode}
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
                      <option value="">Sin asignar</option>
                      {dynamicCategories
                        .filter(cat => cat.nombre !== 'Todos')
                        .map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
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

                   {/* <div className="form-group">
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
                            onClick=() => setNewTeacher(prev => ({ ...prev, photo: null, preview: null }))}
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
                  </div> */}


                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={resetForm}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="submit-btn">
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