import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../assets/styles/dashboard.css'; 

const TeachersschedulePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si más adelante necesitas cargar datos, descomenta y ajusta:
    // const loadData = async () => {
    //   try {
    //     const data = await fetchDashboardData();
    //     setDashboardData(data);
    //   } catch (error) {
    //     console.error('Error loading dashboard data:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadData();

    // Por ahora simulamos que ya cargó:  
    setLoading(false);
  }, []);

  return (
    <div className="teachers-schedule-page w-full pt-30">
      {/* 1) Solo mostramos el Header */}
      <Header />

      {/* 2) Aquí van el título y el subtítulo */}
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold mb-1">Welcome to StratSync</h1>
        <p className="text-gray-700">Sistema de gestión académica y horarios</p>
      </div>

      {/* 3) Contenido que ocupa todo el ancho */}
      <div className="schedule-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <p>Aquí irá el contenido del horario (tabla, etc.).</p>
        )}
      </div>
          
      <div className="schedule-section">
          <p className="dashboard-header">Materias asignadas</p>
          



      </div>
    </div>
  );
};

export default TeachersschedulePage;