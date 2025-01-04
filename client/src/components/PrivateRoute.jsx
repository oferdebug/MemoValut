/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const PrivateRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/login-status`, {
        withCredentials: true
      })
      setIsLoggedIn(response.data.loggedIn)
    } catch (error) {
      console.error('Error checking login status:', error)
      setIsLoggedIn(false)
    }
  }

  if (isLoggedIn === null) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return isLoggedIn ? children : <Navigate to="/login" />
}

export default PrivateRoute;