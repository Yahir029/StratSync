import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import {
  FaPlus, 
  FaTimes, 
  FaCalendarAlt, 
  FaChalkboardTeacher, 
  FaBook, 
  FaEdit, 
  FaTrash, 
  FaUserAlt, 
  FaCheckCircle
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../../services/scheduleService';
import { getTeachers } from '../../services/teacherService';
import { getAllSubjects } from '../../services/subjectsService';
import '../../assets/styles/dashboard.css';

const SchedulePage = () => {
  const { categoriesObj: categories, loading: categoriesLoading } = useCategories();

  // Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '' // 'success' o 'error'
  });

  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClass, setExpandedClass] = useState(null);
  const [showClassDetails, setShowClassDetails] = useState(false);
  
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [hasSelectedTeacher, setHasSelectedTeacher] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    day: '',
    subject_id: '',
    teacher_id: '',
    startTime: '',
    endTime: '',
    category_id: '',
    category_name: '',
    description: '' // Nuevo campo
  });

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 7; hour <= 20; hour++) {
      const startHour = hour.toString().padStart(2, '0');
      const endHour = (hour + 1).toString().padStart(2, '0');
      slots.push({
        start: `${startHour}:00`,
        end: `${endHour}:00`,
        display: `${startHour}:00 - ${endHour}:00`
      });
    }
    return slots;
  }, []);

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

      const schedules = Array.isArray(scheduleRes?.data)
        ? scheduleRes.data
        : Array.isArray(scheduleRes) ? scheduleRes : [];

      const teachersData = Array.isArray(teacherRes?.data)
        ? teacherRes.data
        : Array.isArray(teacherRes) ? teacherRes : [];

      let subjectsData = Array.isArray(subjectRes?.data)
        ? subjectRes.data
        : Array.isArray(subjectRes) ? subjectRes : [];

      subjectsData = subjectsData.map(subject => ({
        ...subject,
        categoria_id: subject.categoria_id || subject.category_id || null
      }));

      const schedulesWithTeacherNames = schedules.map(schedule => {
        const teacher = teachersData.find(t => t.id === schedule.profesor?.id);
        return {
          ...schedule,
          teacherName: teacher
            ? `${teacher.nombres} ${teacher.apellidos}`
            : 'Profesor no disponible',
          hora_inicio: schedule.hora_inicio?.replace(/:00$/, '') || schedule.hora_inicio,
          hora_fin: schedule.hora_fin?.replace(/:00$/, '') || schedule.hora_fin
        };
      });

      setScheduleData(schedulesWithTeacherNames);
      setTeachers(teachersData);
      setSubjects(subjectsData);

      if (teachersData.length > 0 && !selectedTeacherId) {
        setSelectedTeacherId(teachersData[0].id);
        setHasSelectedTeacher(true);
      }

    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar datos: ' + (err.message || 'Por favor intente más tarde'));
      showNotification('Error al cargar horarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredScheduleData = useMemo(() => {
    if (!selectedTeacherId) return [];
    return scheduleData.filter(schedule => 
      schedule.profesor?.id === parseInt(selectedTeacherId)
    );
  }, [scheduleData, selectedTeacherId]);

  const getSubjectName = (schedule) => {
    return schedule.materia?.nombre || 'Materia no disponible';
  };

  const getCategoryId = (schedule) => {
    return schedule.materia?.categoria?.id || schedule.materia?.categoria_id || null;
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId || categoriesLoading || !categories) return 'Sin categoría';
    const category = categories.find(cat => cat.id == categoryId);
    return category ? category.nombre : 'Sin categoría';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'subject_id') {
      const selectedSubject = subjects.find(s => s.id == value);

      if (selectedSubject) {
        const categoryId = selectedSubject.categoria_id || selectedSubject.category_id;
        const categoryName = getCategoryName(categoryId);

        setNewAssignment(prev => ({
          ...prev,
          [name]: value,
          category_id: categoryId || '',
          category_name: categoryName
        }));
      } else {
        setNewAssignment(prev => ({
          ...prev,
          [name]: value,
          category_id: '',
          category_name: 'Seleccione una materia'
        }));
      }
    } else {
      setNewAssignment(prev => ({ ...prev, [name]: value }));
    }
  };

  const formatTimeForBackend = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!newAssignment.day || !newAssignment.subject_id || !newAssignment.teacher_id ||
          !newAssignment.startTime || !newAssignment.endTime) {
        showNotification('Por favor complete todos los campos requeridos', 'error');
        return;
      }

      const dayNumber = days.indexOf(newAssignment.day) + 1;
      if (dayNumber < 1 || dayNumber > 7) {
        showNotification('Día de la semana inválido', 'error');
        return;
      }

      const newSchedule = {
        dia_semana: dayNumber,
        hora_inicio: formatTimeForBackend(newAssignment.startTime),
        hora_fin: formatTimeForBackend(newAssignment.endTime),
        materia_id: parseInt(newAssignment.subject_id),
        profesor_id: parseInt(newAssignment.teacher_id),
        descripcion: newAssignment.description // Nuevo campo
      };

      if (newSchedule.hora_fin <= newSchedule.hora_inicio) {
        showNotification('La hora de fin debe ser posterior a la hora de inicio', 'error');
        return;
      }

      let response;
      if (editingScheduleId) {
        response = await updateSchedule(editingScheduleId, newSchedule);
        showNotification('Horario actualizado correctamente');
      } else {
        response = await createSchedule(newSchedule);
        showNotification('Horario creado correctamente');
      }

      await loadData();
      setShowAssignmentForm(false);
      setEditingScheduleId(null);
      setNewAssignment({
        day: '',
        subject_id: '',
        teacher_id: '',
        startTime: '',
        endTime: '',
        category_id: '',
        category_name: '',
        description: ''
      });

    } catch (err) {
      console.error('Error al guardar horario:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Error desconocido';
      showNotification(`Error: ${errorMsg}`, 'error');
    }
  };

  const normalizeTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes ? minutes.padStart(2, '0').slice(0, 2) : '00'}`;
  };

  const closeModal = () => {
    setShowAssignmentForm(false);
    setEditingScheduleId(null);
    setNewAssignment({
      day: '',
      subject_id: '',
      teacher_id: '',
      startTime: '',
      endTime: '',
      category_id: '',
      category_name: '',
      description: ''
    });
  };

  const handleEditSchedule = (schedule) => {
    setEditingScheduleId(schedule.id);
    setNewAssignment({
      day: days[schedule.dia_semana - 1] || '',
      subject_id: schedule.materia?.id || '',
      teacher_id: schedule.profesor?.id || '',
      startTime: normalizeTime(schedule.hora_inicio),
      endTime: normalizeTime(schedule.hora_fin),
      category_id: getCategoryId(schedule),
      category_name: getCategoryName(getCategoryId(schedule)),
      description: schedule.descripcion || '' // Nuevo campo
    });
    setShowAssignmentForm(true);
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      try {
        await deleteSchedule(id);
        await loadData();
        showNotification('Horario eliminado correctamente');
      } catch (err) {
        console.error('Error al eliminar horario:', err);
        const errorMsg = err.response?.data?.error || err.message || 'Error al eliminar';
        showNotification(`Error: ${errorMsg}`, 'error');
      }
    }
  };

  const handleClassClick = (schedule) => {
    setExpandedClass(schedule);
    setShowClassDetails(true);
  };

  const closeClassDetails = () => {
    setShowClassDetails(false);
    setExpandedClass(null);
  };

  const convertToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const groupedSchedules = useMemo(() => {
    const groups = [];
    const daySlots = days.map(() => 
      timeSlots.map(() => [])
    );
    
    filteredScheduleData.forEach(schedule => {
      const dayIndex = schedule.dia_semana - 1;
      if (dayIndex < 0 || dayIndex >= days.length) return;
      
      const startMinutes = convertToMinutes(schedule.hora_inicio);
      const endMinutes = convertToMinutes(schedule.hora_fin);
      
      for (let i = 0; i < timeSlots.length; i++) {
        const slotStart = convertToMinutes(timeSlots[i].start);
        const slotEnd = convertToMinutes(timeSlots[i].end);
        
        if (startMinutes < slotEnd && endMinutes > slotStart) {
          daySlots[dayIndex][i].push(schedule);
        }
      }
    });
    
    days.forEach((day, dayIndex) => {
      let currentGroup = null;
      
      timeSlots.forEach((slot, slotIndex) => {
        const schedules = daySlots[dayIndex][slotIndex];
        
        if (schedules.length > 0) {
          const schedule = schedules[0];
          
          if (!currentGroup) {
            currentGroup = {
              schedule,
              startSlot: slotIndex,
              endSlot: slotIndex,
              rowSpan: 1
            };
          } else if (currentGroup.schedule.id === schedule.id) {
            currentGroup.endSlot = slotIndex;
            currentGroup.rowSpan++;
          } else {
            groups.push(currentGroup);
            currentGroup = {
              schedule,
              startSlot: slotIndex,
              endSlot: slotIndex,
              rowSpan: 1
            };
          }
        } else if (currentGroup) {
          groups.push(currentGroup);
          currentGroup = null;
        }
      });
      
      if (currentGroup) {
        groups.push(currentGroup);
      }
    });
    
    return groups;
  }, [filteredScheduleData, timeSlots, days]);

  const occupiedCells = useMemo(() => {
    const occupied = Array(days.length)
      .fill()
      .map(() => Array(timeSlots.length).fill(false));
    
    groupedSchedules.forEach(group => {
      for (let i = group.startSlot; i <= group.endSlot; i++) {
        occupied[group.schedule.dia_semana - 1][i] = true;
      }
    });
    
    return occupied;
  }, [groupedSchedules, days, timeSlots]);

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Notificación flotante */}
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            <FaCheckCircle className="notification-icon" />
            <span>{notification.message}</span>
          </div>
        )}

        <div className="schedule-section">
          <div className="schedule-header">
            <h1>StratSync - Horario</h1>
            <div className="header-actions">
              <div className="teacher-select-container">
                <label>
                  <FaUserAlt /> Seleccione profesor:
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => {
                    setSelectedTeacherId(e.target.value);
                    setHasSelectedTeacher(true);
                  }}
                  className="teacher-select"
                >
                  <option value="">-- Seleccione un profesor --</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.nombres} {teacher.apellidos}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                className="add-assignment-btn"
                onClick={() => {
                  setEditingScheduleId(null);
                  setShowAssignmentForm(true);
                }}
              >
                <FaPlus /> Asignar Horario
              </button>
            </div>
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
            <div className="schedule-table-container">
              {!hasSelectedTeacher ? (
                <div className="no-teacher-selected">
                  <FaUserAlt className="user-icon" />
                  <p>Por favor seleccione un profesor para ver su horario</p>
                </div>
              ) : filteredScheduleData.length === 0 ? (
                <div className="no-schedules">
                  <p>No se encontraron horarios para este profesor</p>
                </div>
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
                    {timeSlots.map((timeSlot, rowIndex) => (
                      <tr key={`${timeSlot.start}-${timeSlot.end}`}>
                        <td className="time-slot">{timeSlot.display}</td>
                        {days.map((day, dayIndex) => {
                          const group = groupedSchedules.find(g => 
                            g.schedule.dia_semana - 1 === dayIndex && 
                            g.startSlot === rowIndex
                          );
                          
                          const isOccupied = occupiedCells[dayIndex][rowIndex];
                          const isGroupStart = group && group.startSlot === rowIndex;
                          
                          if (isGroupStart) {
                            return (
                              <td 
                                key={`${day}-${rowIndex}`} 
                                className="schedule-cell"
                                rowSpan={group.rowSpan}
                              >
                                <div 
                                  className="scheduled-class compact"
                                  onClick={() => handleClassClick(group.schedule)}
                                >
                                  <div className="subject">
                                    {getSubjectName(group.schedule)}
                                  </div>
                                  <div className="time">
                                    {normalizeTime(group.schedule.hora_inicio) || '--:--'} - {normalizeTime(group.schedule.hora_fin) || '--:--'}
                                  </div>
                                  {group.schedule.descripcion && (
                                    <div className="description-indicator">
                                      <FaBook />
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          }
                          
                          if (!isOccupied) {
                            return (
                              <td key={`${day}-${rowIndex}`} className="schedule-cell"></td>
                            );
                          }
                          
                          return null;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {showClassDetails && expandedClass && (
          <>
            <div className="class-details-backdrop" onClick={closeClassDetails}></div>
            <div className="class-details-modal">
              <button className="class-details-close" onClick={closeClassDetails}>
                <FaTimes />
              </button>
              <h3>Detalles de la Clase</h3>
              <div className="detail-item">
                <strong>Materia:</strong> {getSubjectName(expandedClass)}
              </div>
              <div className="detail-item">
                <strong>Profesor:</strong> {expandedClass.teacherName}
              </div>
              <div className="detail-item">
                <strong>Horario:</strong> {normalizeTime(expandedClass.hora_inicio) || '--:--'} - {normalizeTime(expandedClass.hora_fin) || '--:--'}
              </div>
              <div className="detail-item">
                <strong>Categoría:</strong> {getCategoryName(getCategoryId(expandedClass))}
              </div>
              {expandedClass.descripcion && (
                <div className="detail-item">
                  <strong>Descripción:</strong> {expandedClass.descripcion}
                </div>
              )}
              <div className="detail-actions">
                <button 
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeClassDetails();
                    handleEditSchedule(expandedClass);
                  }}
                >
                  <FaEdit /> Editar
                </button>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeClassDetails();
                    handleDeleteSchedule(expandedClass.id);
                  }}
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          </>
        )}

        {showAssignmentForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingScheduleId ? 'Editar Horario' : 'Asignar Nueva Clase'}</h3>
                <button className="close-btn" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>

              <div className="form-scroll-container">
                <form onSubmit={handleSubmitAssignment}>
                  <div className="form-section">
                    <h4>Día y Horario</h4>
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
                          min={newAssignment.startTime}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-divider"></div>

                  <div className="form-section">
                    <h4>Profesor y Materia</h4>
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

                    <div className="form-group category-display">
                      <label>Categoría:</label>
                      <span className="category-name">
                        {newAssignment.category_name || 'Seleccione una materia'}
                      </span>
                    </div>

                    <div className="form-group">
                      <label>Descripción (opcional)</label>
                      <textarea
                        name="description"
                        value={newAssignment.description}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Agregar detalles adicionales"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      {editingScheduleId ? 'Actualizar' : 'Asignar'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={closeModal}>
                      Cancelar
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

export default SchedulePage;