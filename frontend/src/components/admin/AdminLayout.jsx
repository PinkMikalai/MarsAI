import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
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
          <div className="admin-main-header-actions">
            <div className="admin-main-search">
              <input
                type="text"
                placeholder="Rechercher…"
                className="admin-main-search-input"
                aria-label="Recherche"
              />
            </div>
          </div>
        </header>
        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
