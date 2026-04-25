import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'users', label: 'User Management', path: '/admin/users' },
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath.includes('/admin/users')) return 'users';
    if (currentPath.includes('/admin/dashboard')) return 'dashboard';
    return 'dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-80 xl:w-96 flex-col border-r border-gray-200 bg-white sticky top-0 h-screen">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">👨‍💼 Admin</h2>
          <p className="text-sm text-gray-600 mt-2">{user?.name || 'Admin User'}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                getActiveTab() === tab.id
                  ? 'bg-red-100 text-red-700 border-l-4 border-red-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">👨‍💼 Admin</h2>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2 sticky top-16 z-20 overflow-x-auto">
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`px-3 py-2 text-sm font-medium rounded whitespace-nowrap transition ${
                  getActiveTab() === tab.id
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
