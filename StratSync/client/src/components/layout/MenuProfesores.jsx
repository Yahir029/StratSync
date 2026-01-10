import React from 'react';
import Header from './Header';
import '../../assets/styles/layout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="strat-sync-app">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;