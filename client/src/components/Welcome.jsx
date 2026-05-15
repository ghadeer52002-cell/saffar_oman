import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <section className="page-layout welcome-screen">
      <div className="welcome-overlay">
        <div className="welcome-header">
          <span className="brand-mark">🧭</span>
          <span className="brand-name">SAFFAR OMAN</span>
        </div>

        <div className="welcome-copy">
          <p className="eyebrow">Discover the soul of</p>
          <h1>Oman</h1>
          <p className="subtitle">Your guide to unforgettable adventures</p>
        </div>

        <div className="welcome-actions">
          <Link className="btn action-primary" to="/register">
            Create Account
          </Link>
          <Link className="btn action-secondary" to="/login">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
