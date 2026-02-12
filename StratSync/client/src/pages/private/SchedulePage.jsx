import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import {
  FaPlus, FaTimes, FaCalendarAlt, FaChalkboardTeacher, FaBook, FaEdit, FaTrash
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

  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
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
    category_name: ''
  });

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Generar franjas horarias cada 60 minutos
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

      const schedules = Array.isArray(scheduleRes?.data)
        ? scheduleRes.data
        : Array.isArray(scheduleRes) ? scheduleRes : [];

      const teachersData = Array.isArray(teacherRes?.data)
        ? teacherRes.data
        : Array.isArray(teacherRes) ? teacherRes : [];

      let subjectsData = Array.isArray(subjectRes?.data)
        ? subjectRes.data
        : Array.isArray(subjectRes) ? subjectRes : [];

      // Normalizar el campo de categoría en las materias
      subjectsData = subjectsData.map(subject => ({
        ...subject,
        categoria_id: subject.categoria_id || subject.category_id || null
      }));

      // Añadir teacherName para cada horario
      const schedulesWithTeacherNames = schedules.map(schedule => {
        const teacher = teachersData.find(t => t.id === schedule.profesor?.id);
        return {
          ...schedule,
          teacherName: teacher
            ? `${teacher.nombres} ${teacher.apellidos}`
            : 'Profesor no disponible',
          // Normalizar horas
          hora_inicio: schedule.hora_inicio?.replace(/:00$/, '') || schedule.hora_inicio,
          hora_fin: schedule.hora_fin?.replace(/:00$/, '') || schedule.hora_fin
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
      // Validación de campos requeridos
      if (!newAssignment.day || !newAssignment.subject_id || !newAssignment.teacher_id ||
          !newAssignment.startTime || !newAssignment.endTime) {
        alert('Por favor complete todos los campos requeridos');
        return;
      }

      // Convertir día de la semana a número (1-7)
      const dayNumber = days.indexOf(newAssignment.day) + 1;
      if (dayNumber < 1 || dayNumber > 7) {
        alert('Día de la semana inválido');
        return;
      }

      const newSchedule = {
        dia_semana: dayNumber,
        hora_inicio: formatTimeForBackend(newAssignment.startTime),
        hora_fin: formatTimeForBackend(newAssignment.endTime),
        materia_id: parseInt(newAssignment.subject_id),
        profesor_id: parseInt(newAssignment.teacher_id)
      };

      // Validar que la hora de fin sea mayor que la de inicio
      if (newSchedule.hora_fin <= newSchedule.hora_inicio) {
        alert('La hora de fin debe ser posterior a la hora de inicio');
        return;
      }

      // Llamada al servicio para crear o actualizar el horario
      let response;
      if (editingScheduleId) {
        response = await updateSchedule(editingScheduleId, newSchedule);
      } else {
        response = await createSchedule(newSchedule);
      }

      // Recargar datos y resetear formulario
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
        category_name: ''
      });

      alert(editingScheduleId 
        ? 'Horario actualizado correctamente' 
        : 'Horario creado correctamente');
    } catch (err) {
      console.error('Error al guardar horario:', err);
      alert(`Error: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
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
      category_name: ''
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
      category_name: getCategoryName(getCategoryId(schedule))
    });
    setShowAssignmentForm(true);
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      try {
        await deleteSchedule(id);
        await loadData();
        alert('Horario eliminado correctamente');
      } catch (err) {
        console.error('Error al eliminar horario:', err);
        alert(`Error: ${err.response?.data?.error || err.message || 'Error al eliminar'}`);
      }
    }
  };

  // Convertir tiempo a minutos para comparaciones
  const convertToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  // Agrupar horarios continuos
  const groupedSchedules = useMemo(() => {
    const groups = [];
    
    // Crear matriz de días x franjas horarias
    const daySlots = days.map(() => 
      timeSlots.map(() => [])
    );
    
    // Asignar horarios a sus celdas correspondientes
    scheduleData.forEach(schedule => {
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
    
    // Agrupar horarios continuos
    days.forEach((day, dayIndex) => {
      let currentGroup = null;
      
      timeSlots.forEach((slot, slotIndex) => {
        const schedules = daySlots[dayIndex][slotIndex];
        
        if (schedules.length > 0) {
          const schedule = schedules[0];
          
          if (!currentGroup) {
            // Comenzar nuevo grupo
            currentGroup = {
              schedule,
              startSlot: slotIndex,
              endSlot: slotIndex,
              rowSpan: 1
            };
          } else if (currentGroup.schedule.id === schedule.id) {
            // Extender grupo existente
            currentGroup.endSlot = slotIndex;
            currentGroup.rowSpan++;
          } else {
            // Guardar grupo actual y comenzar nuevo
            groups.push(currentGroup);
            currentGroup = {
              schedule,
              startSlot: slotIndex,
              endSlot: slotIndex,
              rowSpan: 1
            };
          }
        } else if (currentGroup) {
          // Finalizar grupo actual
          groups.push(currentGroup);
          currentGroup = null;
        }
      });
      
      // Agregar el último grupo del día
      if (currentGroup) {
        groups.push(currentGroup);
      }
    });
    
    return groups;
  }, [scheduleData, timeSlots, days]);

  // Crear matriz de celdas ocupadas
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
        <div className="schedule-section">
          <div className="schedule-header">
            <h1>StratSync - Horario</h1>
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
                          const categoryId = getCategoryId(group.schedule);
                          const categoryName = getCategoryName(categoryId);
                          
                          return (
                            <td 
                              key={`${day}-${rowIndex}`} 
                              className="schedule-cell"
                              rowSpan={group.rowSpan}
                              style={{
                                backgroundColor: categoryId
                                  ? categoryColors[categoryId] || categoryColors.default
                                  : categoryColors.default
                              }}
                            >
                              <div className="scheduled-class">
                                <div className="schedule-header">
                                  <span className="subject">
                                    <FaBook /> {getSubjectName(group.schedule)}
                                  </span>
                                  <div className="schedule-actions">
                                    <button 
                                      className="edit-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditSchedule(group.schedule);
                                      }}
                                    >
                                      <FaEdit />
                                    </button>
                                    <button 
                                      className="delete-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSchedule(group.schedule.id);
                                      }}
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>
                                <span className="teacher">
                                  <FaChalkboardTeacher /> {group.schedule.teacherName}
                                </span>
                                <span className="time">
                                  <FaCalendarAlt />
                                  {normalizeTime(group.schedule.hora_inicio) || '--:--'} - {normalizeTime(group.schedule.hora_fin) || '--:--'}
                                </span>
                                {categoryName && (
                                  <span className="category">
                                    {categoryName}
                                  </span>
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
                        
                        // Celda ocupada pero no es inicio de grupo (omitir)
                        return null;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showAssignmentForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingScheduleId ? 'Editar Horario' : 'Asignar Nueva Clase'}</h3>
                <button className="close-btn" onClick={closeModal}>
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
                      min={newAssignment.startTime}
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

                <div className="form-group category-display">
                  <label>Categoría:</label>
                  <span className="category-name">
                    {newAssignment.category_name || 'Seleccione una materia'}
                  </span>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingScheduleId ? 'Actualizar' : 'Asignar'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SchedulePage;
