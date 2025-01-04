import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#3182ce' }}>
        Welcome to MemoVault
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#4a5568', marginBottom: '2rem' }}>
        Your secure space for storing and organizing personal memos and notes.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/register">
          <button className="btn btn-primary">
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button className="btn btn-ghost">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home;