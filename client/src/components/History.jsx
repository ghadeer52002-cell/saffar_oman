import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function History() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetch(`https://saffar-oman.onrender.com/api/bookings/history/${user._id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.bookings);
        } else {
          setError(data.message || 'Could not load history.');
        }
      })
      .catch((err) => setError(err.message));
  }, [user, navigate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = useMemo(() => {
    return bookings.filter((booking) => {
      const tripDate = new Date(booking.date);
      tripDate.setHours(0, 0, 0, 0);
      return tripDate >= today;
    });
  }, [bookings]);

  const oldTrips = useMemo(() => {
    return bookings.filter((booking) => {
      const tripDate = new Date(booking.date);
      tripDate.setHours(0, 0, 0, 0);
      return tripDate < today;
    });
  }, [bookings]);

  const renderTripCard = (booking) => (
    <div key={booking._id} className="trip-card">
      {booking.image && (
        <img src={booking.image} alt={booking.title} />
      )}

      <div className="trip-body">
        <h3>{booking.title || 'Trip'}</h3>

        <p>{booking.location || '-'}</p>

        <div className="trip-info">
          <span>Date: {booking.date || '-'}</span>
          <span>Time: {booking.time || '-'}</span>
          <span>Days: {booking.days || 1}</span>
          <span>Travelers: {booking.travelers || 1}</span>
        </div>

        <div className="trip-info">
          <span>Payment: {booking.paymentMethod || '-'}</span>
          <span>Status: {booking.status}</span>
        </div>

        <div className="trip-total">
          Total: {booking.total || 0} OMR
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .history-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
          color: #5c4033;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
        }

        .history-header h1 {
          margin: 0;
          font-size: 42px;
        }

        .history-header p {
          margin: 8px 0 0;
          color: #7a6556;
        }

        .back-btn {
          border: none;
          background: #e5d2c1;
          color: #5c4033;
          padding: 12px 18px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 15px;
        }

        .history-section {
          background: #eadccd;
          border-radius: 32px;
          padding: 28px;
          margin-bottom: 35px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
        }

        .history-section h2 {
          margin: 0 0 22px;
          font-size: 30px;
          color: #5c4033;
        }

        .trips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .trip-card {
          background: #e5d2c1;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
        }

        .trip-card img {
          width: 100%;
          height: 210px;
          object-fit: cover;
          display: block;
        }

        .trip-body {
          padding: 22px;
        }

        .trip-body h3 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #5c4033;
        }

        .trip-body p {
          margin: 0 0 14px;
          color: #7a6556;
        }

        .trip-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 12px;
        }

        .trip-info span {
          background: #f4ece3;
          color: #7a6556;
          padding: 9px 12px;
          border-radius: 14px;
          font-size: 14px;
        }

        .trip-total {
          background: #5c4033;
          color: white;
          padding: 13px 15px;
          border-radius: 18px;
          font-weight: bold;
          margin-top: 14px;
          text-align: center;
        }

        .empty-box {
          background: #e5d2c1;
          padding: 35px;
          border-radius: 22px;
          text-align: center;
          color: #7a6556;
        }

        .error-box {
          background: #ffe8e8;
          color: #b42318;
          padding: 14px;
          border-radius: 16px;
          margin-bottom: 18px;
        }

        @media (max-width: 1100px) {
          .trips-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 750px) {
          .history-page {
            padding: 25px 18px;
          }

          .history-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .trips-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="history-page">
        <div className="history-header">
          <div>
            <h1>Trip History</h1>
            <p>Your confirmed bookings and upcoming trips.</p>
          </div>

          <button className="back-btn" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="history-section">
          <h2>Upcoming Trips</h2>

          {upcomingTrips.length > 0 ? (
            <div className="trips-grid">
              {upcomingTrips.map(renderTripCard)}
            </div>
          ) : (
            <div className="empty-box">No upcoming trips yet.</div>
          )}
        </div>

        <div className="history-section">
          <h2>Old Trips</h2>

          {oldTrips.length > 0 ? (
            <div className="trips-grid">
              {oldTrips.map(renderTripCard)}
            </div>
          ) : (
            <div className="empty-box">No old trips yet.</div>
          )}
        </div>
      </section>
    </>
  );
}

export default History;
