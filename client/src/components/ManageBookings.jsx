import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    userId: '',
    siteId: '',
    date: '',
    time: '',
    days: 1,
    status: 'pending',
  });

  const selectedSite = sites.find((site) => site._id === form.siteId);
  const pricePerDay = Number(selectedSite?.pricePerDay || 0);
  const total = pricePerDay * Number(form.days || 1);

  const loadData = () => {
    fetch('http://localhost:3002/api/admin/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBookings(data.bookings);
      });

    fetch('http://localhost:3002/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.users);
      });

    fetch('http://localhost:3002/api/sites')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSites(data.sites);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      userId: '',
      siteId: '',
      date: '',
      time: '',
      days: 1,
      status: 'pending',
    });
  };

  const startEdit = (booking) => {
    setEditingId(booking._id);

    setForm({
      userId: booking.userId || '',
      siteId: booking.siteId || '',
      date: booking.date || '',
      time: booking.time || '',
      days: booking.days || 1,
      status: booking.status || 'pending',
    });
  };

  const saveBooking = async () => {
    if (!form.userId || !form.siteId || !form.date || !form.days) {
      alert('Please select user, place, date, and number of days');
      return;
    }

    const url = editingId
      ? `http://localhost:3002/api/admin/bookings/${editingId}`
      : 'http://localhost:3002/api/admin/bookings/add';

    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    resetForm();
    loadData();
  };

  const deleteBooking = async (id) => {
    await fetch(`http://localhost:3002/api/admin/bookings/${id}`, {
      method: 'DELETE',
    });

    loadData();
  };

  return (
    <>
      <style>{`
        .bookings-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
          color: #5c4033;
        }

        .bookings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .bookings-header h1 {
          margin: 0;
          font-size: 38px;
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

        .form-card {
          background: #eadccd;
          border-radius: 28px;
          padding: 24px;
          margin-bottom: 30px;
          box-shadow: 0 14px 30px rgba(0,0,0,0.08);
        }

        .form-card h2 {
          margin: 0 0 20px;
          font-size: 28px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .form-grid input,
        .form-grid select {
          height: 52px;
          border: 1px solid #d4c0af;
          border-radius: 16px;
          padding: 0 14px;
          outline: none;
          color: #5c4033;
          background: white;
        }

        .price-preview {
          background: #f4ece3;
          border-radius: 18px;
          padding: 18px;
          margin-top: 18px;
          color: #5c4033;
          font-size: 17px;
        }

        .save-btn {
          border: none;
          background: #5c4033;
          color: white;
          padding: 13px 18px;
          border-radius: 18px;
          cursor: pointer;
          margin-top: 18px;
          font-size: 15px;
        }

        .cancel-btn {
          border: none;
          background: #e5d2c1;
          color: #5c4033;
          padding: 13px 18px;
          border-radius: 18px;
          cursor: pointer;
          margin-top: 18px;
          margin-left: 10px;
          font-size: 15px;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .booking-card {
          background: #e5d2c1;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0,0,0,0.08);
        }

        .booking-card img {
          width: 100%;
          height: 190px;
          object-fit: cover;
          display: block;
          background: #d4c0af;
        }

        .booking-body {
          padding: 22px;
        }

        .booking-body h3 {
          margin: 0 0 10px;
          font-size: 24px;
          color: #5c4033;
        }

        .booking-body p {
          margin: 8px 0;
          color: #7a6556;
          line-height: 1.5;
        }

        .status {
          display: inline-block;
          background: #f4ece3;
          color: #5c4033;
          padding: 8px 12px;
          border-radius: 18px;
          margin-top: 8px;
          font-size: 13px;
        }

        .price {
          color: #5c4033;
          font-weight: bold;
          font-size: 20px;
          margin-top: 12px;
        }

        .card-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }

        .edit-btn,
        .delete-btn {
          border: none;
          padding: 10px 14px;
          border-radius: 16px;
          cursor: pointer;
          font-size: 14px;
        }

        .edit-btn {
          background: #5c4033;
          color: white;
        }

        .delete-btn {
          background: #c84c4c;
          color: white;
        }

        .empty-box {
          grid-column: 1 / -1;
          background: #e5d2c1;
          padding: 35px;
          border-radius: 22px;
          text-align: center;
          color: #7a6556;
        }

        @media (max-width: 1200px) {
          .bookings-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 800px) {
          .bookings-page {
            padding: 25px 18px;
          }

          .bookings-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .bookings-grid,
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="bookings-page">
        <div className="bookings-header">
          <h1>Manage Bookings</h1>

          <button className="back-btn" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </button>
        </div>

        <div className="form-card">
          <h2>{editingId ? 'Update Booking' : 'Add New Booking'}</h2>

          <div className="form-grid">
            <select
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName || user.email}
                </option>
              ))}
            </select>

            <select
              value={form.siteId}
              onChange={(e) => setForm({ ...form, siteId: e.target.value })}
            >
              <option value="">Select Place</option>
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.title} - {site.pricePerDay || 0} OMR / day
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />

            <input
              type="number"
              min="1"
              value={form.days}
              onChange={(e) => setForm({ ...form, days: e.target.value })}
              placeholder="Number of days"
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
              <option value="completed">completed</option>
            </select>
          </div>

          <div className="price-preview">
            Price per day: <strong>{pricePerDay} OMR</strong>
            <br />
            Days: <strong>{form.days || 1}</strong>
            <br />
            Total: <strong>{total} OMR</strong>
          </div>

          <button className="save-btn" onClick={saveBooking}>
            {editingId ? 'Save Changes' : 'Add Booking'}
          </button>

          {editingId && (
            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>

        <div className="bookings-grid">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                {booking.image ? (
                  <img src={booking.image} alt={booking.title} />
                ) : (
                  <div style={{ height: '190px', background: '#d4c0af' }} />
                )}

                <div className="booking-body">
                  <h3>{booking.title || 'Unknown Place'}</h3>

                  <p>User: {booking.userName || '-'}</p>
                  <p>Email: {booking.userEmail || '-'}</p>
                  <p>Location: {booking.location || '-'}</p>
                  <p>Date: {booking.date || '-'} {booking.time ? `· ${booking.time}` : ''}</p>
                  <p>Days: {booking.days || 1}</p>
                  <p>Price per day: {booking.pricePerDay || 0} OMR</p>

                  <span className="status">
                    Status: {booking.status || 'pending'}
                  </span>

                  <div className="price">
                    {booking.total || 0} OMR
                  </div>

                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => startEdit(booking)}>
                      Update
                    </button>

                    <button className="delete-btn" onClick={() => deleteBooking(booking._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-box">No bookings found</div>
          )}
        </div>
      </section>
    </>
  );
}

export default ManageBookings;