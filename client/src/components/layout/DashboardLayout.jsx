import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen pt-[var(--navbar-height)]">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden p-4 sm:p-6 md:p-8 lg:p-10 bg-bg-primary min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
