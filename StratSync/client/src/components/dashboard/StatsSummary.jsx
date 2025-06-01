import React from 'react';

const StatsSummary = ({ data }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Cursos</h3>
        <p>{data?.coursesCount || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Profesores</h3>
        <p>{data?.teachersCount || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Estudiantes</h3>
        <p>{data?.studentsCount || 0}</p>
      </div>
    </div>
  );
};

export default StatsSummary;