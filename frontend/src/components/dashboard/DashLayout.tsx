
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DahLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="page-container h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DahLayout;