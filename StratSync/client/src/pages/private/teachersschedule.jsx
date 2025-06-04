import React, { useState } from 'react';
import MenuProfesores from '../../components/layout/MenuProfesores';
import { 
  FaUser, 
  FaCheck, 
  FaPlus, 
  FaTimes, 
  FaPhone, 
  FaEnvelope, 
  FaGraduationCap, 
  FaCalendarAlt,
  FaBriefcase,
  FaInfoCircle,
  FaList,
  FaQuestionCircle,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { useCategories } from '../../context/CategoriesContext';
import '../../assets/styles/teachers.css';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <MainLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome to StratSync</h1>
          <p>Sistema de gestión académica y horarios</p>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            <StatsSummary data={dashboardData} />
            
            <div className="schedule-section">
              <h2>Horarios Asignados</h2>
              <ScheduleTable schedule={dashboardData?.schedule} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default teachers_schedule; 