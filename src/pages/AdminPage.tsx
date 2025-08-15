// src/pages/AdminPage.tsx
import React from 'react';
import Header from '../components/layout/Header';

const AdminPage: React.FC = () => {
  return (
    <div className="admin-page">
      <Header />
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>Admin functionality coming soon...</p>
      </div>
    </div>
  );
};

export default AdminPage;