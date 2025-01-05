import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to MemoVault</h1>
      <p className="home-subtitle">
        Your secure space for storing and organizing personal memos and notes.
      </p>
      <div className="home-buttons">
        <Link to="/register" className="btn btn-primary">
          Get Started
        </Link>
        <Link to="/login" className="btn btn-ghost">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Home;