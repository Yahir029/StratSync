import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { FaBook, FaCheck } from 'react-icons/fa';
import '../../assets/styles/subjects.css';

const SubjectsPage = () => {
  // Categorías de materias
  const categories = [
    'Idiomas',
    'Matemáticas',
    'Ciencias',
    'Humanidades',
    'Tecnología',
    'Artes'
  ];

  // Datos de ejemplo (reemplazar con tu fetch real)
  const [subjectsData, setSubjectsData] = useState({
    'Idiomas': [
      { id: 1, name: 'Inglés', code: 'ENG-101', teacher: 'John Smith' },
      { id: 2, name: 'Francés', code: 'FRA-101', teacher: 'Marie Dupont' }
    ],
    'Matemáticas': [
      { id: 3, name: 'Álgebra', code: 'ALG-201', teacher: 'Carlos Gómez' },
      { id: 4, name: 'Geometría', code: 'GEO-202', teacher: 'Laura Méndez' }
    ]
  });

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false); // Cambiar a true si usas fetch real

  // Para implementación real con API:
  /*
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        const data = await fetchSubjectsData();
        setSubjectsData(data);
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSubjects();
  }, []);
  */

  const toggleSubjectSelection = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId) 
        : [...prev, subjectId]
    );
  };

  return (
    <MainLayout>
      <div className="subjects-container">
        <h1>StratSync - Gestión de Materias</h1>
        
        <div className="main-content">
          {/* Menú lateral de categorías */}
          <div className="categories-sidebar">
            <h2>Categorías</h2>
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
          <div className="subjects-content">
            <div className="subjects-header">
              <h2>{selectedCategory}</h2>
              <p>Materias disponibles en esta categoría</p>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando materias...</p>
              </div>
            ) : (
              <div className="subjects-grid">
                {subjectsData[selectedCategory]?.map(subject => (
                  <div 
                    key={subject.id}
                    className={`subject-card ${selectedSubjects.includes(subject.id) ? 'selected' : ''}`}
                    onClick={() => toggleSubjectSelection(subject.id)}
                  >
                    <div className="subject-icon-container">
                      <FaBook className="subject-icon" />
                      {selectedSubjects.includes(subject.id) && (
                        <div className="selection-badge">
                          <FaCheck />
                        </div>
                      )}
                    </div>
                    <div className="subject-info">
                      <h3>{subject.name}</h3>
                      <p className="subject-code">{subject.code}</p>
                      <p className="subject-teacher">{subject.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

export default SubjectsPage;