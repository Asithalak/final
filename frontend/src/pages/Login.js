import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserShield, FaTools, FaUser } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    /*{ 
      id: 'admin', 
      name: 'Admin', 
      icon: FaUserShield, 
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-600',
      hoverBg: 'hover:bg-red-100'
    },*/
    { 
      id: 'carpenter', 
      name: 'Carpenter', 
      icon: FaTools, 
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-500',
      textColor: 'text-amber-600',
      hoverBg: 'hover:bg-amber-100'
    },
    { 
      id: 'customer', 
      name: 'Customer', 
      icon: FaUser, 
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-100'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      alert('Please select your role');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(credentials);
      
      // Verify role matches
      if (result.role !== selectedRole) {
        alert(`Invalid credentials for ${selectedRole}. Your account is registered as ${result.role}.`);
        setLoading(false);
        return;
      }
      
      // Redirect based on role
      if (result.role === 'carpenter') {
        navigate('/carpenterdashboard');
      } else if (result.role === 'admin') {
        navigate('/admin/users');
      } else if (result.role === 'customer') {
        navigate('/customerdashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const getButtonStyle = () => {
    switch(selectedRole) {
      case 'admin':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'carpenter':
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';
      case 'customer':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      default:
        return 'bg-gray-400 cursor-not-allowed';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 text-center">
            Select your role
          </label>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected 
                      ? `${role.borderColor} ${role.bgColor}` 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${role.hoverBg}`}
                >
                  <Icon className={`mx-auto text-2xl ${isSelected ? role.textColor : 'text-gray-400'}`} />
                  <p className={`mt-2 text-xs font-medium ${isSelected ? role.textColor : 'text-gray-500'}`}>
                    {role.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !selectedRole}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition ${getButtonStyle()}`}
            >
              {loading ? 'Signing in...' : `Sign in as ${selectedRole ? roles.find(r => r.id === selectedRole)?.name : '...'}`}
            </button>
          </div>
        </form>

        {/* Registration Links based on selected role */}
        <div className="text-center border-t pt-4">
          {selectedRole === 'carpenter' && (
            <p className="text-sm text-gray-600">
              New Carpenter?{' '}
              <Link to="/register/carpenter" className="font-medium text-amber-600 hover:text-amber-500">
                Register here
              </Link>
            </p>
          )}
          {selectedRole === 'customer' && (
            <p className="text-sm text-gray-600">
              New Customer?{' '}
              <Link to="/register/customer" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
          )}
          {!selectedRole && (
            <p className="text-sm text-gray-500">
              Select a role to see registration options
            </p>
          )}
        </div>

        {/* Admin Registration Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Admin?{' '}
            <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
              Admin Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
