import React from 'react';
import AdminSidebar from './AdminSidebar';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout-root">
      {/* Navbar fixe commune */}
      <div className="public-layout__navbar">
        <Navbar />
      </div>

      {/* Corps : sidebar + contenu */}
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <header className="admin-main-header">
            <div>
              <h1 className="admin-main-title">Espace festival</h1>
              <p className="admin-main-subtitle">
                Vue d&apos;ensemble et outils de pilotage du festival.
              </p>
            </div>
          </header>
          <main className="admin-main-content">
            {children}
          </main>
        </div>
      </div>

      {/* Footer commun */}
      <div className="public-layout__footer">
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
