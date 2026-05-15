import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const selectedSite = location.state?.site || null;

  const [sites, setSites] = useState([]);
  const [error, setError] = useState('');
  const [locationMessage, setLocationMessage] = useState('');

  const [booking, setBooking] = useState({
    siteId: selectedSite?._id || '',
    date: '',
    time: '',
    pickup: '',
    pickupLat: '',
    pickupLng: '',
    days: 1,
    travelers: 1,
    privateGuide: false,
    mealPackage: false,
    notes: '',
    paymentMethod: 'visa',
    status: 'pending',
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetch('http://https://saffar-oman.onrender.com/api/sites')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSites(data.sites);

          if (!booking.siteId && data.sites.length > 0) {
            setBooking((prev) => ({
              ...prev,
              siteId: data.sites[0]._id,
            }));
          }
        }
      })
      .catch((err) => setError(err.message));
  }, [user, navigate]);

  const selectedPlace = useMemo(() => {
    return sites.find((site) => site._id === booking.siteId);
  }, [sites, booking.siteId]);

  const pricePerDay = Number(selectedPlace?.pricePerDay || 0);
  const days = Number(booking.days || 1);
  const travelers = Number(booking.travelers || 1);

  const baseTotal = pricePerDay * days * travelers;
  const guideFee = booking.privateGuide ? 15 * days : 0;
  const mealFee = booking.mealPackage ? 5 * travelers * days : 0;
  const total = baseTotal + guideFee + mealFee;

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    setBooking((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const changeTravelers = (amount) => {
    setBooking((prev) => ({
      ...prev,
      travelers: Math.max(1, Number(prev.travelers) + amount),
    }));
  };

  const getCurrentLocation = () => {
    setLocationMessage('');

    if (!navigator.geolocation) {
      setLocationMessage('Location service is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setBooking((prev) => ({
          ...prev,
          pickupLat: position.coords.latitude,
          pickupLng: position.coords.longitude,
          pickup: `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`,
        }));

        setLocationMessage('Current location added successfully.');
      },
      () => {
        setLocationMessage('Could not get your current location.');
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    if (!booking.siteId || !booking.date || !booking.time || !booking.pickup) {
      setError('Please complete place, date, time, and pickup location.');
      return;
    }

    if (booking.time < '06:00' || booking.time > '20:00') {
      setError('Booking time must be between 6:00 AM and 8:00 PM');
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/api/bookings/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          siteId: booking.siteId,
          date: booking.date,
          time: booking.time,
          pickup: booking.pickup,
          pickupLat: booking.pickupLat,
          pickupLng: booking.pickupLng,
          days: Number(booking.days),
          travelers: Number(booking.travelers),
          privateGuide: booking.privateGuide,
          mealPackage: booking.mealPackage,
          notes: booking.notes,
          paymentMethod: booking.paymentMethod,
          status: 'pending',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Could not create booking.');
        return;
      }

      navigate('/checkout', {
        state: {
          booking: data.booking,
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <style>{`
        .booking-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
          color: #5c4033;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .booking-header h1 {
          margin: 0;
          font-size: 42px;
          color: #5c4033;
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

        .booking-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 28px;
          align-items: start;
        }

        .booking-card,
        .summary-card {
          background: #eadccd;
          border-radius: 32px;
          padding: 28px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
        }

        .booking-card h2,
        .summary-card h2 {
          margin: 0 0 20px;
          font-size: 28px;
          color: #5c4033;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #5c4033;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          border: 1px solid #d4c0af;
          border-radius: 16px;
          padding: 14px;
          outline: none;
          color: #5c4033;
          font-size: 15px;
          font-family: Arial, sans-serif;
          background: white;
        }

        .form-group input,
        .form-group select {
          height: 52px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .checkbox-row {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .checkbox-item {
          background: #f4ece3;
          padding: 12px 14px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .traveler-control {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .count-btn {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          border: none;
          background: #5c4033;
          color: white;
          font-size: 22px;
          cursor: pointer;
        }

        .location-btn {
          border: none;
          background: #f3c98b;
          color: #2f2118;
          padding: 13px 18px;
          border-radius: 18px;
          cursor: pointer;
          font-size: 15px;
          margin-top: 10px;
        }

        .submit-btn {
          border: none;
          background: #5c4033;
          color: white;
          padding: 15px 22px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
          width: 100%;
        }

        .error-box {
          background: #ffe8e8;
          color: #b42318;
          padding: 14px;
          border-radius: 16px;
          margin-bottom: 18px;
        }

        .location-message {
          color: #7a6556;
          margin-top: 8px;
          font-size: 14px;
        }

        .time-note {
          margin-top: 6px;
          font-size: 13px;
          color: #7a6556;
          line-height: 1.5;
        }

        .place-preview {
          background: #f4ece3;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .place-preview img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
        }

        .place-preview-body {
          padding: 18px;
        }

        .place-preview-body h3 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #5c4033;
        }

        .place-preview-body p {
          margin: 6px 0;
          color: #7a6556;
          line-height: 1.5;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 12px 0;
          border-bottom: 1px solid #d4c0af;
          color: #7a6556;
        }

        .summary-line strong {
          color: #5c4033;
        }

        .total-box {
          background: #5c4033;
          color: white;
          padding: 18px;
          border-radius: 22px;
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          font-weight: bold;
        }

        @media (max-width: 1000px) {
          .booking-layout,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .booking-page {
            padding: 25px 18px;
          }

          .booking-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }
        }
      `}</style>

      <section className="booking-page">
        <div className="booking-header">
          <div>
            <h1>Plan your Trip</h1>
            <p>Choose your place, date, location, and trip options.</p>
          </div>

          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="booking-layout">
          <form className="booking-card" onSubmit={handleSubmit}>
            <h2>Booking Details</h2>

            {error && <div className="error-box">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>Choose Place</label>

                <select
                  value={booking.siteId}
                  onChange={handleChange('siteId')}
                >
                  <option value="">Select place</option>

                  {sites.map((site) => (
                    <option key={site._id} value={site._id}>
                      {site.title} - {site.pricePerDay || 0} OMR / day
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Date</label>

                <input
                  type="date"
                  value={booking.date}
                  onChange={handleChange('date')}
                />
              </div>

              <div className="form-group">
                <label>Time</label>

                <input
                  type="time"
                  min="06:00"
                  max="20:00"
                  value={booking.time}
                  onChange={(event) => {
                    const selectedTime = event.target.value;

                    if (
                      selectedTime < '06:00' ||
                      selectedTime > '20:00'
                    ) {
                      setError(
                        'Booking time must be between 6:00 AM and 8:00 PM'
                      );
                      return;
                    }

                    setError('');

                    setBooking((prev) => ({
                      ...prev,
                      time: selectedTime,
                    }));
                  }}
                />

                <p className="time-note">
                  Booking time is available only from 6:00 AM to 8:00 PM.
                </p>
              </div>

              <div className="form-group">
                <label>Number of Days</label>

                <input
                  type="number"
                  min="1"
                  value={booking.days}
                  onChange={handleChange('days')}
                />
              </div>

              <div className="form-group">
                <label>Number of Travelers</label>

                <div className="traveler-control">
                  <button
                    type="button"
                    className="count-btn"
                    onClick={() => changeTravelers(-1)}
                  >
                    -
                  </button>

                  <input type="text" value={booking.travelers} readOnly />

                  <button
                    type="button"
                    className="count-btn"
                    onClick={() => changeTravelers(1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method</label>

                <select
                  value={booking.paymentMethod}
                  onChange={handleChange('paymentMethod')}
                >
                  <option value="visa">Visa</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Pick Up Location</label>

                <input
                  type="text"
                  placeholder="Enter hotel name or address"
                  value={booking.pickup}
                  onChange={handleChange('pickup')}
                />

                <button
                  type="button"
                  className="location-btn"
                  onClick={getCurrentLocation}
                >
                  Use Current Location
                </button>

                {locationMessage && (
                  <div className="location-message">
                    {locationMessage}
                  </div>
                )}
              </div>

              <div className="form-group full-width">
                <label>Additional Options</label>

                <div className="checkbox-row">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={booking.privateGuide}
                      onChange={handleChange('privateGuide')}
                    />

                    Private Tour Guide +15 OMR/day
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={booking.mealPackage}
                      onChange={handleChange('mealPackage')}
                    />

                    Meal Package +5 OMR/traveler/day
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Additional Notes</label>

                <textarea
                  rows="4"
                  placeholder="Special requests..."
                  value={booking.notes}
                  onChange={handleChange('notes')}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Proceed To Checkout
            </button>
          </form>

          <aside className="summary-card">
            <h2>Trip Summary</h2>

            {selectedPlace && (
              <div className="place-preview">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.title}
                />

                <div className="place-preview-body">
                  <h3>{selectedPlace.title}</h3>

                  <p>{selectedPlace.location}</p>

                  <p>{selectedPlace.description}</p>
                </div>
              </div>
            )}

            <div className="summary-line">
              <span>Price per day</span>
              <strong>{pricePerDay} OMR</strong>
            </div>

            <div className="summary-line">
              <span>Days</span>
              <strong>{days}</strong>
            </div>

            <div className="summary-line">
              <span>Travelers</span>
              <strong>{travelers}</strong>
            </div>

            <div className="summary-line">
              <span>Base total</span>
              <strong>{baseTotal} OMR</strong>
            </div>

            <div className="summary-line">
              <span>Private guide</span>
              <strong>{guideFee} OMR</strong>
            </div>

            <div className="summary-line">
              <span>Meal package</span>
              <strong>{mealFee} OMR</strong>
            </div>

            <div className="total-box">
              <span>Total</span>
              <span>{total} OMR</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Booking;
