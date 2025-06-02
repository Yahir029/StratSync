import React from 'react';

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
          </tr>
        </thead>
        <tbody>
          {schedule?.map((item, index) => (
            <tr key={index}>
              <td className="time-slot">{item.time}</td>
              <td>
                {item.monday && (
                  <div className="scheduled-class">
                    <span className="subject">{item.monday.subject}</span>
                    <span className="teacher">{item.monday.teacher}</span>
                  </div>
                )}
              </td>
              <td>
                {item.tuesday && (
                  <div className="scheduled-class">
                    <span className="subject">{item.tuesday.subject}</span>
                    <span className="teacher">{item.tuesday.teacher}</span>
                  </div>
                )}
              </td>
              <td>
                {item.wednesday && (
                  <div className="scheduled-class">
                    <span className="subject">{item.wednesday.subject}</span>
                    <span className="teacher">{item.wednesday.teacher}</span>
                  </div>
                )}
              </td>
              <td>
                {item.thursday && (
                  <div className="scheduled-class">
                    <span className="subject">{item.thursday.subject}</span>
                    <span className="teacher">{item.thursday.teacher}</span>
                  </div>
                )}
              </td>
              <td>
                {item.friday && (
                  <div className="scheduled-class">
                    <span className="subject">{item.friday.subject}</span>
                    <span className="teacher">{item.friday.teacher}</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;