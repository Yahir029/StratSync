import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import {
  FaPlus, FaTimes, FaCalendarAlt, FaChalkboardTeacher, FaBook
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import {
  getAllSchedules,
  createSchedule
} from '../../services/scheduleService';
import { getTeachers } from '../../services/teacherService';
import { getAllSubjects } from '../../services/subjectsService';
import '../../assets/styles/dashboard.css';

const SchedulePage = () => {
  const { categories } = useCategories();

  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newAssignment, setNewAssignment] = useState({
    day: '',
    subject_id: '',
    teacher_id: '',
    startTime: '',
    endTime: '',
    category_id: '',
    category_name: '' // Nuevo campo para el nombre de la categoría
  });

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const timeSlots = [
    '7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00',
    '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00'
  ];

  const categoryColors = {
    1: '#FFB7B2',   // Idiomas
    2: '#FF9AA2',   // Matemáticas
    3: '#E2F0CB',   // Humanidades
    8: '#B5EAD7',   // Tecnología
    'default': '#F5F5F5'
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduleRes, teacherRes, subjectRes] = await Promise.all([
        getAllSchedules(),
        getTeachers(),
        getAllSubjects()
      ]);
      
      // Verificar estructuras de respuesta
      const schedules = Array.isArray(scheduleRes?.data) 
        ? scheduleRes.data 
        : Array.isArray(scheduleRes) ? scheduleRes : [];
      
      const teachersData = Array.isArray(teacherRes?.data) 
        ? teacherRes.data 
        : Array.isArray(teacherRes) ? teacherRes : [];
      
      const subjectsData = Array.isArray(subjectRes?.data) 
        ? subjectRes.data 
        : Array.isArray(subjectRes) ? subjectRes : [];

      // Combinar datos de profesores con horarios
      const schedulesWithTeacherNames = schedules.map(schedule => {
        // Buscar profesor por ID
        const teacher = teachersData.find(t => t.id === schedule.profesor?.id);
        
        return {
          ...schedule,
          teacherName: teacher 
            ? `${teacher.nombres} ${teacher.apellidos}` 
            : 'Profesor no disponible'
        };
      });

      setScheduleData(schedulesWithTeacherNames);
      setTeachers(teachersData);
      setSubjects(subjectsData);

    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar datos: ' + (err.message || 'Por favor intente más tarde'));
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (schedule) => {
    return schedule.materia?.nombre || 'Materia no disponible';
  };

  const getCategoryId = (schedule) => {
    return schedule.materia?.categoria_id || null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Actualizar categoría automáticamente cuando se selecciona una materia
    if (name === 'subject_id') {
      const selectedSubject = subjects.find(s => s.id == value);
      
      if (selectedSubject) {
        // Buscar el nombre de la categoría
        const category = categories.find(cat => cat.id == selectedSubject.categoria_id);
        const categoryName = category ? category.nombre : 'Sin categoría';
        
        setNewAssignment(prev => ({
          ...prev,
          [name]: value,
          category_id: selectedSubject.categoria_id || '',
          category_name: categoryName // Actualizar el nombre de la categoría
        }));
      } else {
        setNewAssignment(prev => ({
          ...prev,
          [name]: value,
          category_id: '',
          category_name: ''
        }));
      }
    } else {
      setNewAssignment(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();

    try {
      const formatTime = (time) => time ? `${time}:00` : '';
      
      const newSchedule = {
        dia_semana: days.indexOf(newAssignment.day) + 1,
        hora_inicio: formatTime(newAssignment.startTime),
        hora_fin: formatTime(newAssignment.endTime),
        materia_id: newAssignment.subject_id,
        profesor_id: newAssignment.teacher_id
      };

      await createSchedule(newSchedule);
      await loadData();
      setShowAssignmentForm(false);
      setNewAssignment({
        day: '',
        subject_id: '',
        teacher_id: '',
        startTime: '',
        endTime: '',
        category_id: '',
        category_name: ''
      });
      alert('Horario asignado correctamente');
    } catch (err) {
      console.error('Error al asignar horario:', err);
      alert('Error al asignar horario: ' + (err.response?.data?.message || err.message));
    }
  };

  const normalizeTime = (time) => {
    if (!time) return '';
    return time.slice(0, 5).replace(/^0/, '');
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <div className="schedule-section">
          <div className="schedule-header">
            <h1>StratSync - Horario</h1>
            <button
              className="add-assignment-btn"
              onClick={() => setShowAssignmentForm(true)}
            >
              <FaPlus /> Asignar Horario
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={loadData} className="retry-btn">Reintentar</button>
            </div>
          )}

          {loading ? (
            <div className="loading-indicator">Cargando horarios...</div>
          ) : (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  {days.map(day => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => {
                  const [start] = timeSlot.split(' - ');
                  return (
                    <tr key={timeSlot}>
                      <td className="time-slot">{timeSlot}</td>
                      {days.map(day => {
                        return (
                          <td key={`${day}-${timeSlot}`}>
                            {scheduleData
                              .filter(schedule => {
                                try {
                                  // Verificar día
                                  const scheduleDay = days[schedule.dia_semana - 1];
                                  if (scheduleDay !== day) return false;
                                  
                                  // Verificar hora
                                  const scheduleStart = normalizeTime(schedule.hora_inicio);
                                  return scheduleStart === start;
                                } catch (error) {
                                  console.error("Error en filtro:", schedule);
                                  return false;
                                }
                              })
                              .map(schedule => {
                                const categoryId = getCategoryId(schedule);
                                
                                return (
                                  <div
                                    key={schedule.id}
                                    className="scheduled-class"
                                    style={{
                                      backgroundColor: categoryId 
                                        ? categoryColors[categoryId] || categoryColors.default 
                                        : categoryColors.default
                                    }}
                                  >
                                    <span className="subject">
                                      <FaBook /> {getSubjectName(schedule)}
                                    </span>
                                    <br />
                                    <span className="teacher">
                                      <FaChalkboardTeacher /> {schedule.teacherName}
                                    </span>
                                    <br />
                                    <span className="time">
                                      <FaCalendarAlt /> 
                                      {schedule.hora_inicio?.slice(0, 5) || '--:--'} - {schedule.hora_fin?.slice(0, 5) || '--:--'}
                                    </span>
                                  </div>
                                );
                              })}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Formulario modal */}
        {showAssignmentForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Asignar Nueva Clase</h3>
                <button className="close-btn" onClick={() => setShowAssignmentForm(false)}>
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmitAssignment}>
                <div className="form-group">
                  <label>Día</label>
                  <select
                    name="day"
                    value={newAssignment.day}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar día</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Hora de inicio</label>
                    <input
                      type="time"
                      name="startTime"
                      value={newAssignment.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hora de fin</label>
                    <input
                      type="time"
                      name="endTime"
                      value={newAssignment.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Profesor</label>
                  <select
                    name="teacher_id"
                    value={newAssignment.teacher_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar profesor</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.nombres} {teacher.apellidos}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Materia</label>
                  <select
                    name="subject_id"
                    value={newAssignment.subject_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar materia</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <input
                    type="text"
                    value={newAssignment.category_name || 'Seleccione una materia'}
                    readOnly
                    className="read-only"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAssignmentForm(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="submit-btn">
                    Asignar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sección de depuración para ver datos */}
        <div className="debug-section" style={{ marginTop: '50px', padding: '20px', background: '#f0f0f0' }}>
          <h3>Datos de Depuración</h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', marginRight: '20px' }}>
              <h4>Horarios ({scheduleData.length})</h4>
              <pre>{JSON.stringify(scheduleData.slice(0, 3), null, 2)}</pre>
            </div>
            
            <div style={{ flex: 1, minWidth: '300px', marginRight: '20px' }}>
              <h4>Profesores ({teachers.length})</h4>
              <pre>{JSON.stringify(teachers.slice(0, 3), null, 2)}</pre>
            </div>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h4>Materias ({subjects.length})</h4>
              <pre>{JSON.stringify(subjects.slice(0, 3), null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SchedulePage;
