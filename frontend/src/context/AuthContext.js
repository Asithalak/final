import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const register = async (userData) => {
    try {
      console.log('Attempting to register with data:', { ...userData, password: '***' });
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      let userDataResult = response.data;
      try {
        const userResponse = await authAPI.getCurrentUser();
        userDataResult = userResponse.data;
      } catch (fetchError) {
        console.error('Failed to fetch current user after registration:', fetchError);
      }
      setUser(userDataResult);
      toast.success('Registration successful!');
      return userDataResult;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      let userDataResult = response.data;
      try {
        const userResponse = await authAPI.getCurrentUser();
        userDataResult = userResponse.data;
      } catch (fetchError) {
        console.error('Failed to fetch current user after login:', fetchError);
      }
      setUser(userDataResult);
      toast.success('Login successful!');
      return userDataResult;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCarpenter: user?.role === 'carpenter',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
