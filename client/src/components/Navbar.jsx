import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

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
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/logout`, {
        withCredentials: true
      })
      setIsLoggedIn(false)
      toast.success('Logged out successfully')
      navigate('/login')
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          MemoVault
        </Link>

        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <button className="btn btn-ghost">Dashboard</button>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-ghost">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;