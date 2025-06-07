// src/pages/private/TeachersPage.jsx

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
// --- CONTEXTOS Y ESTADOS ---
const { categories, dynamicCategories } = useCategories();

const [teachersByCategory, setTeachersByCategory] = useState({});
const [selectedCategory, setSelectedCategory] = useState('Todos');
const [selectedTeachers, setSelectedTeachers] = useState([]);
const [showForm, setShowForm] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [editingTeacherId, setEditingTeacherId] = useState(null);

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

// --- CARGAR PROFESORES DESDE BACKEND ---
const loadTeachers = async () => {
try {
const data = await getTeachers();
// Agrupar por categoría
const agrupados = data.reduce((acc, t) => {
const cat = t.categoria_nombre || 'Sin asignar';
if (!acc[cat]) acc[cat] = [];
acc[cat].push(t);
return acc;
}, {});
setTeachersByCategory(agrupados);
setSelectedTeachers([]);
} catch (err) {
console.error('Error cargando profesores:', err.message);
alert('Error cargando profesores: ' + err.message);
}
};

useEffect(() => {
loadTeachers();
}, []);

// --- AUX: OBTENER PROFESORES FILTRADOS POR CATEGORÍA ---
const getTeachersByCategory = () => {
if (selectedCategory === 'Todos') {
return Object.values(teachersByCategory).flat();
}
return teachersByCategory[selectedCategory] || [];
};

// --- CONTROL DE SELECCIÓN MÚLTIPLE ---
const toggleTeacherSelection = (id) => {
setSelectedTeachers(prev =>
prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
);
};

const handleEditSelected = () => {
if (selectedTeachers.length === 1) {
const teacherList = Object.values(teachersByCategory).flat();
const toEdit = teacherList.find(t => t.id === selectedTeachers[0]);
if (toEdit) {
prepareEditForm(toEdit);
}
}
};

const deleteSelectedTeachers = async () => {
if (selectedTeachers.length === 0) return;
if (!window.confirm(`¿Eliminar ${selectedTeachers.length > 1 ? 'estos profesores' : 'este profesor'}?`)) {
return;
}
try {
// Eliminar uno por uno
await Promise.all(selectedTeachers.map(id => deleteTeacher(id)));
await loadTeachers();
} catch (err) {
console.error('Error al eliminar:', err.message);
alert('Error al eliminar: ' + err.message);
}
};

// --- PREPARAR FORMULARIO PARA EDICIÓN ---
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
preview: null,
});
setEditingTeacherId(teacher.id);
setIsEditing(true);
setShowForm(true);
};

// --- MANEJO DE CAMPOS DE FORMULARIO ---
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

// --- ENVIAR FORMULARIO (Crear o Editar) ---
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
  creado_por: 1, // O el ID que tengas en AuthContext  
  // Para foto_perfil, si tu backend acepta Base64 o multipart, ajusta aquí.  
};  

try {  
  if (isEditing && editingTeacherId) {  
    await updateTeacher(editingTeacherId, payload);  
  } else {  
    await createTeacher(payload);  
  }  
  // Reset y recarga  
  setIsEditing(false);  
  setEditingTeacherId(null);  
  setShowForm(false);  
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
  await loadTeachers();  
} catch (err) {
  console.error('Error al guardar el profesor:', err);
  const mensaje = err.response?.data?.error || err.message || 'Error desconocido';
  alert('Error al guardar el profesor: ' + mensaje);
}
};

return (
<MainLayout>
<div className="teachers-container">
<h1>StratSync - Gestión de Profesores</h1>


<div className="main-content">  
      {/* Sidebar de categorías */}  
      <div className="categories-sidebar">  
        <h2>Categorías</h2>  
        <ul>  
          {categories.map(cat => (  
            <li  
              key={cat}  
              className={selectedCategory === cat ? 'active' : ''}  
              onClick={() => {  
                setSelectedCategory(cat);  
                setSelectedTeachers([]);  
              }}  
            >  
              {cat === 'Todos' && <FaList className="category-icon" />}  
              {cat === 'Sin asignar' && <FaQuestionCircle className="category-icon" />}  
              {cat}  
            </li>  
          ))}  
        </ul>  
      </div>  

      {/* Lista de tarjetas de profesores */}  
      <div className="teachers-content">  
        <div className="teachers-header">  
          <h2>Profesores - {selectedCategory}</h2>  
          <div className="teachers-actions">  
            <button  
              className="add-teacher-btn"  
              onClick={() => {  
                setShowForm(true);  
                setIsEditing(false);  
                setEditingTeacherId(null);  
                setSelectedTeachers([]);  
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
              }}  
            >  
              <FaPlus /> Nuevo Profesor  
            </button>    
          </div>  
        </div>  



        <div className="teachers-grid">
          {getTeachersByCategory().map((teacher) => (  
            <div  
              key={teacher.id}  
              className={`teacher-card ${  
                selectedTeachers.includes(teacher.id) ? 'selected' : ''  
              }`}  
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
                <h4>  
                  {teacher.nombres} {teacher.apellidos}  
                </h4>  
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

    {/* Modal de formulario */}  
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
                setEditingTeacherId(null);  
                setSelectedTeachers([]);  
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
                  <label>  
                    <FaEnvelope /> Correo Electrónico  
                  </label>  
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
                  <label>  
                    <FaPhone /> Teléfono  
                  </label>  
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
                  {dynamicCategories.map(cat => (  
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
                  onClick={() => {  
                    setShowForm(false);  
                    setIsEditing(false);  
                    setEditingTeacherId(null);  
                    setSelectedTeachers([]);  
                  }}  
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


        {selectedTeachers.length > 0 && (
  <div className="sticky-actions">
    {selectedTeachers.length === 1 && (
      <button
        className="edit-teacher-btn"
        onClick={handleEditSelected}
      >
        <FaEdit /> Editar
      </button>
    )}
    <button
      className="delete-teacher-btn"
      onClick={deleteSelectedTeachers}
    >
      <FaTrash /> {selectedTeachers.length === 1 ? 'Borrar' : `Borrar (${selectedTeachers.length})`}
    </button>
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
