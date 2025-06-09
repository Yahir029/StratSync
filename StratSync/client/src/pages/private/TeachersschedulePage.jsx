import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../assets/styles/dashboard.css'; 

const mockSchedule = [
  { profesor: "Juan Pérez", materia: "Matemáticas", dia: "Lunes", horaInicio: "08:00", horaFin: "09:00", aula: "101" },
  { profesor: "Ana García", materia: "Biología", dia: "Martes", horaInicio: "10:00", horaFin: "11:00", aula: "102" },
  { profesor: "Luis Martínez", materia: "Historia", dia: "Miércoles", horaInicio: "12:00", horaFin: "13:00", aula: "103" },
];

const TeachersschedulePage = () => {
  const [loading, setLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
  ];

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  useEffect(() => {
          //  Aquí puedes reemplazar con fetch real si usas backend/API
    setHorarios(mockSchedule);
    setLoading(false);

                      //        useEffect(() => {                    ------  PARA UNA LLAMADA A API  -------------
                    //  fetch('/api/horarios-profesores')  // Ruta hacia tu backend o API
                      //  .then((res) => {
                       //   if (!res.ok) {
                          //  throw new Error('Error al obtener los horarios');
                       //   }
                        //  return res.json();
                      //  })
                      //  .then((data) => setHorarios(data))
                      //  .catch((err) => {
                        //  console.error('Error en la petición:', err);
                      //  });
                  //  }, []);

  }, []);

  // Función para encontrar materia en cada celda
  const getClase = (dia, slot) => {
    const [inicio, fin] = slot.split(' - ');
    const clase = horarios.find(
      (h) =>
        h.dia === dia &&
        h.horaInicio === inicio &&
        h.horaFin === fin
    );
    return clase ? `${clase.materia} (${clase.profesor})` : '';
  };

  return (
    <div className="teachers-schedule-page w-full pt-30">
      <Header />

      <div className="dashboard-header">
        <h1 className="text-2xl font-bold mb-1">Welcome to StratSync</h1>
        <p className="text-gray-700">Sistema de gestión académica y horarios</p>
      </div>

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
                  {dias.map((dia) => (
                    <th key={dia}>{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, index) => (
                  <tr key={index}>
                    <td>{slot}</td>
                    {dias.map((dia) => (
                      <td key={dia}>{getClase(dia, slot)}</td>
                    ))}
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