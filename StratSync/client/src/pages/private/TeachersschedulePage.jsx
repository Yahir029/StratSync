import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayoutTeacher';
import '../../assets/styles/teachersschedule.css';
import { useAuth } from '../../context/AuthContext';

const TeachersschedulePage = () => {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClass, setExpandedClass] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL;

  const dias = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' }
  ];

  // Generar slots cada 30 minutos desde las 7:00 hasta las 20:30
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const start = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? '00' : '30';
        const end = `${endHour.toString().padStart(2, '0')}:${endMinute}`;
        
        // Solo agregar slots válidos (hasta 20:30)
        if (hour < 20 || (hour === 20 && minute === 0)) {
          slots.push(`${start} - ${end}`);
        }
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatHora = (hora) => hora?.substring(0, 5) || '--:--';

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        if (!user?.id) return;

        setLoading(true);
        const response = await fetch(`${API_BASE}/api/horarios/maestro/${user.id}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Ordenar por día y hora de inicio
        const horariosOrdenados = data.sort((a, b) =>
          a.dia_semana - b.dia_semana ||
          a.hora_inicio.localeCompare(b.hora_inicio)
        );

        setHorarios(horariosOrdenados);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching horarios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, [user, API_BASE]);

  const toggleExpandClass = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const getClase = (diaId, timeSlot) => {
    const [horaInicioSlot] = timeSlot.split(' - ');
    const clase = horarios.find(h =>
      h.dia_semana === diaId &&
      formatHora(h.hora_inicio) === horaInicioSlot
    );

    if (!clase) return null;

    const isExpanded = expandedClass === clase.id;

    return (
      <div 
        className={`scheduled-class ${isExpanded ? 'expanded' : ''}`}
        onClick={() => toggleExpandClass(clase.id)}
      >
        <div className="class-summary">
          <div className="subject">{clase.materia.nombre}</div>
          <div className="time">{formatHora(clase.hora_inicio)} - {formatHora(clase.hora_fin)}</div>
        </div>
        
        {isExpanded && (
          <div className="class-details">
            <div className="detail-row">
              <span className="detail-label">Profesor:</span>
              <span className="detail-value">{clase.profesor.nombre}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Categoría:</span>
              <span className="detail-value">{clase.materia.categoria.nombre}</span>
            </div>
            {clase.descripcion && (
              <div className="detail-row">
                <span className="detail-label">Descripción:</span>
                <span className="detail-value">{clase.descripcion}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <MainLayout>
        <div className="teachers-schedule-page">
          <div className="error-message">
            <h2>Error al cargar el horario</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              Reintentar
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="teachers-schedule-page">
        <div className="dashboard-header">
          <h1>Bienvenid@, {user?.nombre}</h1>
          <p>Tu horario personalizado</p>
        </div>

        <div className="schedule-section">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando horario...</p>
            </div>
          ) : horarios.length === 0 ? (
            <div className="empty-state">
              <h2>No tienes clases asignadas esta semana</h2>
              <p>Por favor, contacta a administración si esto es un error</p>
            </div>
          ) : (
            <>
              <h2>Horario del Profesor</h2>
              <div className="schedule-container">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th className="time-header">Horario</th>
                      {dias.map(dia => (
                        <th key={dia.id} className="day-header">
                          {dia.nombre}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, index) => (
                      <tr key={index}>
                        <td className="time-slot">{slot}</td>
                        {dias.map(dia => (
                          <td
                            key={`${dia.id}-${index}`}
                            className="schedule-cell"
                          >
                            {getClase(dia.id, slot)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TeachersschedulePage;