import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/v1/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging in');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/v1/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      toast.success('Registered successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error registering');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging out');
    }
  };

  return {
    isAuthenticated,
    login,
    register,
    logout
  };
}