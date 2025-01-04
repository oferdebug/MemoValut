import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/login`,
        { email, password },
        { withCredentials: true }
      )
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', padding: '2rem' }}>
      <div style={{ maxWidth: '32rem', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem' }}>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              style={{ width: '100%', padding: '1rem', fontSize: '16px', border: '1px solid #ccc' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password"
              style={{ width: '100%', padding: '1rem', fontSize: '16px', border: '1px solid #ccc' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '1rem', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login;