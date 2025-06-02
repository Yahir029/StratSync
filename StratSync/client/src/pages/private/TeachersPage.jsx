import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { FaUser, FaCheck } from 'react-icons/fa';
import '../../assets/styles/teachers.css';

const TeachersPage = () => {
  // Datos de ejemplo
  const categories = [
    'Idiomas',
    'Matemáticas',
    'Computación',
    'Ciencias',
    'Artes'
  ];

  const teachersData = {
    'Idiomas': [
      { id: 1, name: 'John Smith', subject: 'English' },
      { id: 2, name: 'Marie Dupont', subject: 'Francés' }
    ],
    'Matemáticas': [
      { id: 3, name: 'Carlos Gómez', subject: 'Álgebra' },
      { id: 4, name: 'Laura Méndez', subject: 'Trigonometría' }
    ],
    'Computación': [
      { id: 5, name: 'Ana Torres', subject: 'Programación' },
      { id: 6, name: 'David López', subject: 'Robótica' }
    ]
  };

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const toggleTeacherSelection = (teacherId) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId) 
        : [...prev, teacherId]
    );
  };

  return (
    <MainLayout>
      <div className="teachers-container">
        <h1>StratSync - Profesores</h1>
        
        <div className="main-content">
          {/* Menú lateral de categorías */}
          <div className="categories-sidebar">
            <h2>Cursos</h2>
            <ul>
              {categories.map(category => (
                <li 
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Contenido principal */}
          <div className="teachers-content">
            <h2>Profesores - {selectedCategory}</h2>
            
            <div className="teachers-grid">
              {teachersData[selectedCategory]?.map(teacher => (
                <div 
                  key={teacher.id}
                  className={`teacher-card ${selectedTeachers.includes(teacher.id) ? 'selected' : ''}`}
                  onClick={() => toggleTeacherSelection(teacher.id)}
                >
                  <div className="teacher-oval">
                    <FaUser className="teacher-icon" />
                    {selectedTeachers.includes(teacher.id) && (
                      <div className="selection-badge">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                  <div className="teacher-info">
                    <h4>{teacher.name}</h4>
                    <p>{teacher.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer">
          <p>StratSync v1.0</p>
          <p>Sistema de Gestión Académica</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeachersPage;