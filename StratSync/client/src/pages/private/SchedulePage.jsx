import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { 
  FaPlus, 
  FaTimes,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaBook
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import '../../assets/styles/dashboard.css';

const SchedulePage = () => {
  const { categories } = useCategories();
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    day: '',
    timeSlot: '',
    subject: '',
    teacher: '',
    startTime: '',
    endTime: ''
  });

  // Datos de ejemplo - en una app real estos vendrían de tu backend
  const [scheduleData, setScheduleData] = useState([
    {
      id: 1,
      day: 'Lunes',
      time: '9:00 - 10:00',
      subject: 'Matemáticas',
      teacher: 'Prof. García',
      category: 'Matemáticas',
      startTime: '09:00',
      endTime: '10:00'
    },
    {
      id: 2,
      day: 'Miércoles',
      time: '10:00 - 11:00',
      subject: 'Historia',
      teacher: 'Prof. Martínez',
      category: 'Humanidades',
      startTime: '10:00',
      endTime: '11:00'
    }
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Prof. García', categories: ['Matemáticas'] },
    { id: 2, name: 'Prof. Martínez', categories: ['Humanidades'] }
  ]);

  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Matemáticas', category: 'Matemáticas' },
    { id: 2, name: 'Historia', category: 'Humanidades' },
    { id: 3, name: 'Inglés', category: 'Idiomas' }
  ]);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const timeSlots = [
    '7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00',
    '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00'
  ];

  // Colores por categoría
  const categoryColors = {
    'Matemáticas': '#FF9AA2',
    'Idiomas': '#FFB7B2',
    'Ciencias': '#FFDAC1',
    'Humanidades': '#E2F0CB',
    'Tecnología': '#B5EAD7',
    'Artes': '#C7CEEA',
    'Sin asignar': '#F5F5F5'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
    
    // Actualizar categoría cuando se selecciona una materia
    if (name === 'subject') {
      const selectedSubject = subjects.find(s => s.name === value);
      if (selectedSubject) {
        setNewAssignment(prev => ({
          ...prev,
          category: selectedSubject.category
        }));
      }
    }
  };

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    
    const newId = Math.max(...scheduleData.map(item => item.id), 0) + 1;
    const timeString = `${newAssignment.startTime} - ${newAssignment.endTime}`;
    
    const newScheduleItem = {
      id: newId,
      day: newAssignment.day,
      time: timeString,
      subject: newAssignment.subject,
      teacher: newAssignment.teacher,
      category: newAssignment.category,
      startTime: newAssignment.startTime,
      endTime: newAssignment.endTime
    };
    
    // Actualizar horario
    setScheduleData(prev => [...prev, newScheduleItem]);
    
    // Actualizar categoría del profesor
    const selectedTeacher = teachers.find(t => t.name === newAssignment.teacher);
    const subjectCategory = subjects.find(s => s.name === newAssignment.subject)?.category;
    
    if (selectedTeacher && subjectCategory && 
        !selectedTeacher.categories.includes(subjectCategory)) {
      setTeachers(prev =>
        prev.map(teacher =>
          teacher.name === newAssignment.teacher
            ? {
                ...teacher,
                categories: [...teacher.categories, subjectCategory]
              }
            : teacher
        )
      );
    }
    
    // Reset form
    setNewAssignment({
      day: '',
      timeSlot: '',
      subject: '',
      teacher: '',
      startTime: '',
      endTime: '',
      category: ''
    });
    setShowAssignmentForm(false);
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
              {timeSlots.map(time => (
                <tr key={time}>
                  <td className="time-slot">{time}</td>
                  {days.map(day => {
                    const classItem = scheduleData.find(
                      item => item.day === day && item.time === time
                    );
                    
                    return (
                      <td key={`${day}-${time}`}>
                        {classItem ? (
                          <div 
                            className="scheduled-class"
                            style={{ 
                              backgroundColor: categoryColors[classItem.category] || '#F5F5F5'
                            }}
                          >
                            <span className="subject">
                              <FaBook /> {classItem.subject}
                            </span>
                            <br />
                            <span className="teacher">
                              <FaChalkboardTeacher /> {classItem.teacher}
                            </span>
                            <br />
                            <span className="time">
                              <FaCalendarAlt /> {classItem.time}
                            </span>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para asignar horario */}
        {showAssignmentForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Asignar Nueva Clase</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowAssignmentForm(false)}
                >
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
                    name="teacher"
                    value={newAssignment.teacher}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar profesor</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Materia</label>
                  <select
                    name="subject"
                    value={newAssignment.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar materia</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Categoría</label>
                  <input
                    type="text"
                    name="category"
                    value={newAssignment.category}
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
                  <button 
                    type="submit"
                    className="submit-btn"
                  >
                    Asignar
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