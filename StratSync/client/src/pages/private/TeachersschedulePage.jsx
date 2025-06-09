import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../assets/styles/teachersschedule.css';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../context/AuthContext';

const TeachersschedulePage = () => {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Días de la semana (1 = Lunes, 6 = Sábado)
  const dias = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' }
  ];

  // Rangos horarios (ajustables según tus necesidades)
  const timeSlots = [
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00'
  ];

  // Formatear hora de la BD (ej: "18:36:00" → "18:36")
  const formatHora = (hora) => hora?.substring(0, 5) || '--:--';

  // Obtener horarios del profesor
  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        if (!user?.id) return;
        
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/horarios/maestro/${user.id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Ordenar por día y hora
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
  }, [user]);

  // Encontrar clase para un día y horario específico
  const getClase = (diaId, timeSlot) => {
    const [horaInicioSlot] = timeSlot.split(' - ');
    const clase = horarios.find(h => 
      h.dia_semana === diaId && 
      formatHora(h.hora_inicio) === horaInicioSlot
    );

    if (!clase) return null;

    return (
      <div className="scheduled-class">
        <div className="subject">{clase.materia.nombre}</div>
        <div className="category">{clase.materia.categoria.nombre}</div>
        <div className="classroom">Aula: {clase.aula || 'Por asignar'}</div>
        <div className="time">
          {formatHora(clase.hora_inicio)} - {formatHora(clase.hora_fin)}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="teachers-schedule-page">
        <Header />
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
    );
  }

  return (
    <div className="teachers-schedule-page">
      <Header />

      <div className="dashboard-header">
        <h1>Bienvenido, {user?.nombre}</h1>
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
  );
};

export default TeachersschedulePage;
