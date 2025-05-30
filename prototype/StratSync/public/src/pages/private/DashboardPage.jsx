import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import ScheduleTable from '../../components/dashboard/ScheduleTable';
import StatsSummary from '../../components/dashboard/StatsSummary';
import { fetchDashboardData } from '../../services/dashboardService';
import '../../assets/styles/dashboard.css';

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
          <h1>Bienvenido a StratSync</h1>
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

export default DashboardPage;