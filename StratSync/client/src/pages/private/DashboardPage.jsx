import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { FaBook, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';
import ScheduleTable from '../../components/dashboard/ScheduleTable';
import { fetchDashboardData } from '../../services/dashboardService';
import '../../assets/styles/dashboard.css';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalTeachers: 0,
    schedules: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        // Transformar datos para la tabla
        const formattedData = transformToTableData(data.schedules);
        setTableData(formattedData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Error al cargar datos del dashboard. Por favor intente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Función para transformar los horarios a formato de tabla
  const transformToTableData = (schedules) => {
    // Crear un mapa para agrupar por hora
    const timeSlotMap = new Map();
    
    schedules.forEach(schedule => {
      const start = formatTime(schedule.hora_inicio);
      const end = formatTime(schedule.hora_fin);
      const timeKey = `${start}-${end}`;
      const day = schedule.dia_semana;
      
      if (!timeSlotMap.has(timeKey)) {
        timeSlotMap.set(timeKey, {
          time: `${start} - ${end}`,
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        });
      }
      
      const classInfo = {
        subject: schedule.materia?.nombre || 'Sin materia',
        teacher: schedule.profesor?.nombres 
          ? `${schedule.profesor.nombres} ${schedule.profesor.apellidos}`
          : 'Sin profesor',
        description: schedule.descripcion || ''
      };
      
      switch(day) {
        case 1: timeSlotMap.get(timeKey).monday.push(classInfo); break;
        case 2: timeSlotMap.get(timeKey).tuesday.push(classInfo); break;
        case 3: timeSlotMap.get(timeKey).wednesday.push(classInfo); break;
        case 4: timeSlotMap.get(timeKey).thursday.push(classInfo); break;
        case 5: timeSlotMap.get(timeKey).friday.push(classInfo); break;
        case 6: timeSlotMap.get(timeKey).saturday.push(classInfo); break;
        case 7: timeSlotMap.get(timeKey).sunday.push(classInfo); break;
        default: break;
      }
    });
    
    // Ordenar por hora de inicio
    return Array.from(timeSlotMap.values()).sort((a, b) => {
      const timeA = a.time.split(' - ')[0];
      const timeB = b.time.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });
  };

  // Formatear la hora (remover segundos si existen)
  const formatTime = (time) => {
    if (!time) return '';
    return time.replace(/:00$/, '') || time;
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome to StratSync</h1>
          <p>Sistema de gestión académica y horarios</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => window.location.reload()} className="retry-btn">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBook />
                </div>
                <h3>Cursos Registrados</h3>
                <p>{dashboardData.totalCourses}</p>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaChalkboardTeacher />
                </div>
                <h3>Profesores</h3>
                <p>{dashboardData.totalTeachers}</p>
              </div>
            </div>
            
            {/* Horarios */}
            <div className="schedule-section">
              <h2>
                <FaCalendarAlt /> Horarios Asignados
              </h2>
              
              {dashboardData.schedules.length === 0 ? (
                <div className="no-schedules">
                  <p>No se encontraron horarios asignados</p>
                </div>
              ) : (
                <ScheduleTable schedule={tableData} />
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;