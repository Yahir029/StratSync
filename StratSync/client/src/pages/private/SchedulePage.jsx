import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/styles/dashboard.css';

const SchedulePage = () => {
  // Datos de ejemplo - reemplaza con tus datos reales
  const scheduleData = [
    {
      day: 'Lunes',
      time: '9:00 - 10:00',
      subject: 'Matemáticas',
      teacher: 'Prof. García'
    },
    {
      day: 'Miércoles',
      time: '10:00 - 11:00',
      subject: 'Historia',
      teacher: 'Prof. Martínez'
    }
    // Agrega más horarios según necesites
  ];

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const timeSlots = [
    '7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00',
    '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00'
  ];

  return (
    <MainLayout>
      <div className="dashboard-container">
        <div className="schedule-section">
          <h1>StratSync - Horario</h1>
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
                          <div className="scheduled-class">
                            <span className="subject">{classItem.subject}</span>
                            <br />
                            <span className="teacher">{classItem.teacher}</span>
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
      </div>
    </MainLayout>
  );
};

export default SchedulePage;