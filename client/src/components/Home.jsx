import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/UserSlice';

import palms from '../assets/palms.jpg';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/api/reviews/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) return `${seconds} sec ago`;

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hrs ago`;

    const days = Math.floor(hours / 24);

    return `${days} days ago`;
  };

  return (
    <>
      <style>{`
        .home-page {
          min-height: 100vh;
          background: #f5efe7;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 18px;
        }

        .brand-title {
          font-size: 52px;
          color: #5c4033;
          margin: 0;
          font-weight: bold;
        }

        .brand-subtitle {
          margin-top: 10px;
          font-size: 20px;
          color: #7a6556;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .top-btn {
          border: none;
          border-radius: 35px;
          padding: 16px 28px;
          font-size: 17px;
          cursor: pointer;
          transition: 0.3s;
        }

        .edit-btn {
          background: #e5d2c1;
          color: #5c4033;
        }

        .edit-btn:hover {
          background: #dbc2ac;
        }

        .logout-btn {
          background: #5c4033;
          color: white;
        }

        .logout-btn:hover {
          background: #4a3127;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 30px;
          margin-bottom: 45px;
        }

        .hero-card {
          border-radius: 35px;
          min-height: 420px;
          padding: 55px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: white;
          box-shadow: 0 20px 45px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url(${palms});
          background-size: cover;
          background-position: center;
          opacity: 0.55;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.18);
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-card h2 {
          font-size: 72px;
          margin: 0;
          line-height: 1.1;
          font-weight: bold;
        }

        .hero-card p {
          margin-top: 18px;
          font-size: 24px;
          max-width: 620px;
          color: rgba(255,255,255,0.95);
          line-height: 1.6;
        }

        .side-panel {
          background: #eadccd;
          border-radius: 35px;
          padding: 30px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .panel-card {
          background: white;
          border-radius: 28px;
          padding: 22px;
          transition: 0.3s;
          cursor: pointer;
          border: 1px solid #eee;
        }

        .panel-card:hover {
          transform: translateY(-4px);
        }

        .panel-card h3 {
          margin: 0 0 10px;
          color: #5c4033;
          font-size: 24px;
        }

        .panel-card p {
          margin: 0;
          color: #7a6556;
          font-size: 15px;
          line-height: 1.5;
        }

        .section-title {
          font-size: 42px;
          color: #5c4033;
          margin-bottom: 28px;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .review-card {
          background: #eadccd;
          border-radius: 30px;
          padding: 28px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }

        .review-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .review-avatar {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          overflow: hidden;
          background: #8b6cff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
        }

        .review-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .review-user h4 {
          margin: 0;
          color: #5c4033;
          font-size: 21px;
        }

        .review-user span {
          color: #8a7666;
          font-size: 14px;
        }

        .review-stars {
          margin-bottom: 16px;
          color: #d49a00;
          font-size: 20px;
        }

        .review-text {
          color: #5c4033;
          line-height: 1.7;
          font-size: 16px;
        }

        .admin-reply {
          margin-top: 18px;
          background: white;
          padding: 16px;
          border-radius: 18px;
          border-left: 5px solid #5c4033;
        }

        .admin-reply strong {
          display: block;
          margin-bottom: 8px;
          color: #5c4033;
        }

        .empty-box {
          background: #eadccd;
          padding: 35px;
          border-radius: 28px;
          text-align: center;
          color: #7a6556;
          font-size: 18px;
        }

        @media (max-width: 1000px) {
          .home-page {
            padding: 25px 18px;
          }

          .hero-section {
            grid-template-columns: 1fr;
          }

          .hero-card {
            min-height: 320px;
            padding: 35px;
          }

          .hero-card h2 {
            font-size: 46px;
          }

          .hero-card p {
            font-size: 20px;
          }

          .top-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .top-actions {
            width: 100%;
          }
        }
      `}</style>

      <section className="home-page">
        <div className="top-bar">
          <div>
            <h1 className="brand-title">Saffar Oman</h1>

            <p className="brand-subtitle">
              Discover beautiful places around Oman
            </p>
          </div>

          <div className="top-actions">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: '#e5d2c1',
                padding: '12px 22px',
                borderRadius: '40px',
                minWidth: '240px',
              }}
            >
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#8b6cff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '24px',
                }}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  (user?.fullName ||
                    user?.username ||
                    user?.email?.split('@')[0] ||
                    'U')
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    color: '#7a6556',
                  }}
                >
                  Welcome
                </span>

                <strong
                  style={{
                    fontSize: '20px',
                    color: '#000',
                  }}
                >
                  {user?.fullName ||
                    user?.username ||
                    user?.email?.split('@')[0]}
                </strong>
              </div>
            </div>

            <button
              className="top-btn edit-btn"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Profile
            </button>

            <button className="top-btn logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        <div className="hero-section">
          <div className="hero-card">
            <div className="hero-bg"></div>

            <div className="hero-overlay"></div>

            <div className="hero-content">
              <h2>Discover Oman</h2>

              <p>
                Explore mountains, deserts, beaches, and historical
                attractions across Oman with Saffar Oman.
              </p>
            </div>
          </div>

          <div className="side-panel">
            <div
              className="panel-card"
              onClick={() => navigate('/attractions')}
            >
              <h3>Explore Attractions</h3>

              <p>
                Discover famous tourist destinations and hidden gems in Oman.
              </p>
            </div>

            <div
              className="panel-card"
              onClick={() => navigate('/booking')}
            >
              <h3>Book a Trip</h3>

              <p>
                Plan your next adventure and confirm your booking easily.
              </p>
            </div>

            <div
              className="panel-card"
              onClick={() => navigate('/history')}
            >
              <h3>Trip History</h3>

              <p>
                View your upcoming and previous confirmed bookings.
              </p>
            </div>
          </div>
        </div>

        <h2 className="section-title">
          Latest Reviews & Feedback
        </h2>

        {reviews.length === 0 ? (
          <div className="empty-box">
            No feedback added yet.
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div className="review-card" key={review._id}>
                <div className="review-top">
                  <div className="review-avatar">
                    {review.userProfileImage ? (
                      <img
                        src={review.userProfileImage}
                        alt="profile"
                      />
                    ) : (
                      (review.userName || 'U')
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="review-user">
                    <h4>{review.userName}</h4>

                    <span>
                      {formatTimeAgo(review.createdAt)}
                    </span>
                  </div>
                </div>

               

                <div className="review-text">
                  {review.comment}
                </div>

                {review.adminReply && (
                  <div className="admin-reply">
                    <strong>Admin Reply</strong>

                    <div>{review.adminReply}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;