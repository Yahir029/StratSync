import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../assets/styles/dashboard.css'; 

const mockSchedule = [
  { profesor: "Juan Pérez", materia: "Matemáticas", dia: "Lunes", hora: "08:00 - 10:00", aula: "101" },
  { profesor: "Ana García", materia: "Biología", dia: "Martes", hora: "10:00 - 12:00", aula: "102" },
  { profesor: "Luis Martínez", materia: "Historia", dia: "Miércoles", hora: "12:00 - 14:00", aula: "103" },
];

const TeachersschedulePage = () => {
  const [loading, setLoading] = useState(true);

    const timeSlots = [
            '08:00 - 09:00',
            '09:00 - 10:00',
            '10:00 - 11:00',
            '11:00 - 12:00',
            '12:00 - 13:00',
            '13:00 - 14:00',
          ];

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

    // Por ahora simulwamos que ya cargó:  
    setLoading(false);
  }, []);

    return (
    <div className="teachers-schedule-page w-full pt-30">
      {/* Header */}
      <Header />

      {/* Título */}
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold mb-1">Welcome to StratSync</h1>
        <p className="text-gray-700">Sistema de gestión académica y horarios</p>
      </div>

      {/* Contenido */}
      <div className="schedule-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">Materias asignadas</h2>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Horario</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miércoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                </tr>
              </thead>
              <tbody>
                {/* Aquí deberías generar filas por horario */}
                {timeSlots.map((timeSlot, index) => (
                  <tr key={index}>
                    <td>{timeSlot}</td>
                    <td>{/* Clase del lunes en ese horario */}</td>
                    <td>{/* Clase del martes en ese horario */}</td>
                    <td>{/* Clase del miércoles en ese horario */}</td>
                    <td>{/* Clase del jueves en ese horario */}</td>
                    <td>{/* Clase del viernes en ese horario */}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default TeachersschedulePage;