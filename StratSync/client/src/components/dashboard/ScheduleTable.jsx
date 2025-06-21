import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const ScheduleTable = ({ schedule }) => {
  return (
    <div className="schedule-table-container">
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th>Sábado</th>
            <th>Domingo</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td className="time-slot">{item.time}</td>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <td key={day} className="schedule-cell">
                  {item[day].length > 0 && (
                    <div className="class-stack">
                      {item[day].map((classInfo, classIndex) => (
                        <div key={classIndex} className="scheduled-class compact">
                          <div className="subject">{classInfo.subject}</div>
                          <div className="teacher">{classInfo.teacher}</div>
                          {classInfo.description && (
                            <div className="description-indicator" title={classInfo.description}>
                              <FaInfoCircle size={12} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;