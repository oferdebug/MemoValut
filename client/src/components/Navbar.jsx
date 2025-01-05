import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      <Link to="/" className="nav-brand">
        MemoVault
      </Link>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
            <button onClick={logout} className="btn btn-ghost">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;