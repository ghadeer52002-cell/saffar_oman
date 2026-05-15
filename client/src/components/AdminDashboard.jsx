import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3002/api/admin/dashboard')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
          color: #5c4033;
        }

        .admin-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .admin-title h1 {
          margin: 0;
          font-size: 38px;
          font-weight: 800;
        }

        .admin-title p {
          margin: 8px 0 0;
          color: #7a6556;
        }

        .nav-buttons {
          display: flex;
          gap: 12px;
        }

        .nav-btn {
          border: none;
          background: #e5d2c1;
          color: #5c4033;
          padding: 12px 18px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 14px;
          text-decoration: none;
        }

        .dashboard-card {
          background: #eadccd;
          border-radius: 32px;
          padding: 30px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
          margin-bottom: 35px;
        }

        .last-update {
          background: #e5d2c1;
          padding: 16px 20px;
          border-radius: 20px;
          color: #7a6556;
          margin-bottom: 25px;
        }

        .last-update strong {
          color: #5c4033;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: #f4ece3;
          border-radius: 24px;
          padding: 24px;
          min-height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .stat-card span {
          color: #7a6556;
          margin-bottom: 12px;
        }

        .stat-card strong {
          color: #5c4033;
          font-size: 34px;
        }

        .tools-header {
          margin: 35px 0 20px;
        }

        .tools-header h2 {
          margin: 0;
          font-size: 32px;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .tool-card {
          background: #e5d2c1;
          border-radius: 28px;
          padding: 26px;
          text-decoration: none;
          color: #5c4033;
          min-height: 230px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: 0.25s;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
        }

        .tool-card:hover {
          transform: translateY(-6px);
          background: #ddc6b4;
        }

        .tool-icon {
          width: 58px;
          height: 58px;
          border: 2px solid #5c4033;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 18px;
        }

        .tool-card h3 {
          margin: 0 0 10px;
          font-size: 24px;
        }

        .tool-card p {
          margin: 0;
          color: #7a6556;
          line-height: 1.5;
        }

        @media (max-width: 1100px) {
          .stats-grid,
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .admin-page {
            padding: 25px 18px;
          }

          .admin-navbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .stats-grid,
          .tools-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="admin-page">
        <nav className="admin-navbar">
          <div className="admin-title">
            <h1>Saffar Oman</h1>
            <p>Admin Dashboard</p>
          </div>

          <div className="nav-buttons">

            <button className="nav-btn" onClick={() => navigate('/')}>
              Sign Out
            </button>
          </div>
        </nav>

        <div className="dashboard-card">
          <div className="last-update">
            Last Update:{' '}
            <strong>
              {stats ? new Date(stats.lastUpdate).toLocaleString() : 'Loading...'}
            </strong>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Places</span>
              <strong>{stats ? stats.totalPlaces : '-'}</strong>
            </div>

            <div className="stat-card">
              <span>Total Bookings</span>
              <strong>{stats ? stats.totalBookings : '-'}</strong>
            </div>

            <div className="stat-card">
              <span>Total Reviews</span>
              <strong>{stats ? stats.totalReviews : '-'}</strong>
            </div>

            <div className="stat-card">
              <span>Total Users</span>
              <strong>{stats ? stats.totalUsers : '-'}</strong>
            </div>
          </div>
        </div>

        <div className="tools-header">
          <h2>Admin Tools</h2>
        </div>

        <div className="tools-grid">
          <Link className="tool-card" to="/admin/users">
            <div>
              <div className="tool-icon">👤</div>
              <h3>Manage Users</h3>
              <p>View, update, and delete registered users.</p>
            </div>
          </Link>

          <Link className="tool-card" to="/admin/sites">
            <div>
              <div className="tool-icon">⌖</div>
              <h3>Manage Places</h3>
              <p>Add, view, update, and delete places.</p>
            </div>
          </Link>

          <Link className="tool-card" to="/admin/reviews">
            <div>
              <div className="tool-icon">✎</div>
              <h3>Manage Reviews</h3>
              <p>View user reviews and respond.</p>
            </div>
          </Link>

          <Link className="tool-card" to="/admin/bookings">
            <div>
              <div className="tool-icon">☑</div>
              <h3>Manage Bookings</h3>
              <p>View and manage reservations.</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

export default AdminDashboard;