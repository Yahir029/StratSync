import React from 'react';
import Header from './Header';
import '../../assets/styles/layoutTeacher.css';

const MainLayout = ({ children }) => {
  return (
    <div className="strat-sync-app">
      <Header />
      <div className="main-container">
    
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;