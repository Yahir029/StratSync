import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import CourseSection from '../../components/subjects/CourseSection';
import { fetchSubjectsData } from '../../services/subjectsService';
import '../../assets/styles/subjects.css';

const SubjectsPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchSubjectsData();
        setCourses(data);
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSubjects();
  }, []);

  return (
    <MainLayout>
      <div className="subjects-container">
        <div className="subjects-header">
          <h1>Materias Académicas</h1>
          <p>Gestión de asignaturas por curso</p>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando materias...</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseSection 
                key={course.id} 
                course={course} 
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SubjectsPage;