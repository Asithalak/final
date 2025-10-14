import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';
import CarpenterDashboard from '../components/dashboard/CarpenterDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'carpenter':
        return <CarpenterDashboard />;
      case 'customer':
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">
          {user?.role === 'admin' && 'Admin Dashboard'}
          {user?.role === 'carpenter' && 'Carpenter Dashboard'}
          {user?.role === 'customer' && 'My Dashboard'}
        </h1>

        {getDashboardComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
