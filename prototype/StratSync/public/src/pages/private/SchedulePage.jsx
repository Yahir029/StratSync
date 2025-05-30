import React from 'react';
import '../../assets/styles/dashboard.css';

const ScheduleTable = ({ schedule = [] }) => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const timeSlots = [
    '7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', 
    '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00'
  ];

  return (
    <div className="schedule-table-container">
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Horario</th>
            {days.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, timeIndex) => (
            <tr key={time}>
              <td className="time-slot">{time}</td>
              {days.map((day, dayIndex) => {
                const scheduleItem = schedule.find(
                  item => item.day === dayIndex && item.time === timeIndex
                );
                
                return (
                  <td key={`${day}-${time}`} className="schedule-cell">
                    {scheduleItem ? (
                      <div className="scheduled-class">
                        <span className="subject">{scheduleItem.subject}</span>
                        <span className="teacher">{scheduleItem.teacher}</span>
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
  );
};

export default ScheduleTable;