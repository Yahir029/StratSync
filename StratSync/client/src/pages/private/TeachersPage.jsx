import React, { useState, useEffect } from 'react';
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
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher
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

  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    category: 'Sin asignar',
    code: '',
    photo: null,
    preview: null,
  });

  const { categories: dynamicCategories } = useCategories();

  // --- Efectos ---
  useEffect(() => {
    loadTeachers();
  }, []);

  // --- Funciones principales ---
  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await getTeachers();

      const agrupados = data.reduce((acc, t) => {
        const cat = t.categoria_nombre || 'Sin asignar';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(t);
        return acc;
      }, {});

      setTeachersByCategory(agrupados);
      setTeachers(data);
      setSelectedTeachers([]);
      setError(null);
    } catch (err) {
      console.error('Error cargando profesores:', err);
      setError(err.message);
      alert('Error cargando profesores: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
  const prepareEditForm = (teacher) => {
    setNewTeacher({
      firstName: teacher.nombres || '',
      lastName: teacher.apellidos || '',
      email: teacher.correo || '',
      phone: teacher.telefono || '',
      bio: teacher.biografia || '',
      category: teacher.categoria_nombre || 'Sin asignar',
      code: teacher.codigo_acceso_maestro || '',
      photo: null,
      preview: teacher.foto_perfil
        ? `data:image/*;base64,${teacher.foto_perfil}`
        : null,
    });
    setEditingTeacherId(teacher.id);
    setIsEditing(true);
    setShowForm(true);
  };

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
    } catch (err) {
      console.error('Error al eliminar:', err);
      setError('Error al eliminar: ' + err.message);
      alert('Error al eliminar: ' + err.message);
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
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
    setNewTeacher(prev => ({ ...prev, code: randomCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombres: newTeacher.firstName,
      apellidos: newTeacher.lastName,
      correo: newTeacher.email,
      telefono: newTeacher.phone,
      biografia: newTeacher.bio,
      categoria_nombre: newTeacher.category,
      codigo_acceso_maestro: newTeacher.code,
      creado_por: 1, // Reemplazar con ID de usuario real
    };

    try {
      if (isEditing && editingTeacherId) {
        await updateTeacher(editingTeacherId, payload);
      } else {
        await createTeacher(payload);
      }

      resetForm();
      await loadTeachers();
    } catch (err) {
      console.error('Error al guardar:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Error desconocido';
      setError('Error al guardar: ' + errorMsg);
      alert('Error al guardar: ' + errorMsg);
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
      category: 'Sin asignar',
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
          <button onClick={loadTeachers}>Reintentar</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="teachers-container">
        <h1>StratSync - Gestión de Profesores</h1>

        <div className="main-content">
          {/* Sidebar de categorías - Versión corregida */}
      
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
      .filter(cat => cat !== 'Todos' && cat !== 'Sin asignar')
      .map(cat => (
        <li
          key={cat}
          className={selectedCategory === cat ? 'active' : ''}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
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
                    {teacher.categoria_nombre === 'Sin asignar' && (
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
                      {dynamicCategories
                        .filter(cat => cat !== 'Todos') // Filtramos aquí también por si acaso
                        .map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
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
