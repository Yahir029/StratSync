import React from 'react';
import '../../assets/styles/subjects.css';

const CourseSection = ({ course }) => {
  return (
    <div className="course-card">
      <h2 className="course-title">{course.name}</h2>
      
      <div className="subjects-container">
        {course.subjects.map((subject, index) => (
          <div key={index} className="subject-item">
            <div className="subject-image-container">
              <img 
                src={subject.image || '/assets/images/default-subject.png'} 
                alt={subject.name} 
                className="subject-image"
              />
            </div>
            <div className="subject-info">
              <h3 className="subject-name">{subject.name}</h3>
              <p className="subject-teacher">{subject.teacher}</p>
              <p className="subject-schedule">{subject.schedule}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSection;