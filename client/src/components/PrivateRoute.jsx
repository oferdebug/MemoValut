/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import Spinner from './Spinner';

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get('/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Auth check response:', response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <Spinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default PrivateRoute;