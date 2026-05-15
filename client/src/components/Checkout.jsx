import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;

  const [payment, setPayment] = useState(booking?.paymentMethod || 'visa');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate('/booking');
    }
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  const confirmBooking = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3002/api/bookings/confirm/${booking._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethod: payment,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Could not confirm booking.');
        setLoading(false);
        return;
      }

      navigate('/home');
    } catch (err) {
      console.log(err);
      setError('Server error while confirming booking.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .checkout-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
          color: #5c4033;
        }

        .checkout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .checkout-header h1 {
          margin: 0;
          font-size: 42px;
          color: #5c4033;
        }

        .checkout-header p {
          color: #7a6556;
          margin: 8px 0 0;
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

        .checkout-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: start;
        }

        .checkout-card,
        .price-card {
          background: #eadccd;
          border-radius: 32px;
          padding: 28px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
        }

        .checkout-card h2,
        .price-card h2 {
          margin: 0 0 20px;
          font-size: 28px;
          color: #5c4033;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-box {
          background: #f4ece3;
          border-radius: 20px;
          padding: 18px;
        }

        .summary-box span {
          display: block;
          color: #7a6556;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .summary-box p {
          margin: 0;
          color: #5c4033;
          font-size: 17px;
          font-weight: 700;
        }

        .place-card {
          background: #f4ece3;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 22px;
        }

        .place-card img {
          width: 100%;
          height: 230px;
          object-fit: cover;
          display: block;
        }

        .place-body {
          padding: 18px;
        }

        .place-body h3 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #5c4033;
        }

        .place-body p {
          margin: 6px 0;
          color: #7a6556;
          line-height: 1.5;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 13px 0;
          border-bottom: 1px solid #d4c0af;
          color: #7a6556;
        }

        .price-row strong {
          color: #5c4033;
        }

        .total-row {
          background: #5c4033;
          color: white;
          padding: 18px;
          border-radius: 22px;
          margin-top: 18px;
          border-bottom: none;
          font-size: 20px;
          font-weight: bold;
        }

        .total-row strong {
          color: white;
        }

        .payment-panel {
          margin-top: 24px;
          background: #f4ece3;
          padding: 20px;
          border-radius: 22px;
        }

        .payment-panel h2 {
          margin-bottom: 15px;
          font-size: 24px;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 14px;
          border-radius: 16px;
          margin-bottom: 10px;
          color: #5c4033;
          cursor: pointer;
        }

        .confirm-btn {
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

        .confirm-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-box {
          background: #ffe8e8;
          color: #b42318;
          padding: 14px;
          border-radius: 16px;
          margin-bottom: 18px;
        }

        @media (max-width: 1000px) {
          .checkout-layout,
          .summary-grid {
            grid-template-columns: 1fr;
          }

          .checkout-page {
            padding: 25px 18px;
          }

          .checkout-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }
        }
      `}</style>

      <section className="checkout-page">
        <div className="checkout-header">
          <div>
            <h1>Checkout</h1>
            <p>Review your booking details before confirmation.</p>
          </div>

          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="checkout-layout">
          <div className="checkout-card">
            <h2>Booking Summary</h2>

            {error && <div className="error-box">{error}</div>}

            {booking.image && (
              <div className="place-card">
                <img src={booking.image} alt={booking.title} />

                <div className="place-body">
                  <h3>{booking.title || 'Selected Place'}</h3>
                  <p>{booking.location || '-'}</p>
                </div>
              </div>
            )}

            <div className="summary-grid">
              <div className="summary-box">
                <span>Destination</span>
                <p>{booking.title || booking.destination || 'Selected Place'}</p>
              </div>

              <div className="summary-box">
                <span>Date</span>
                <p>{booking.date || '-'}</p>
              </div>

              <div className="summary-box">
                <span>Time</span>
                <p>{booking.time || '-'}</p>
              </div>

              <div className="summary-box">
                <span>Travelers</span>
                <p>{booking.travelers || 1}</p>
              </div>

              <div className="summary-box">
                <span>Days</span>
                <p>{booking.days || 1}</p>
              </div>

              <div className="summary-box">
                <span>Pickup Location</span>
                <p>{booking.pickup || '-'}</p>
              </div>

              <div className="summary-box">
                <span>Private Guide</span>
                <p>{booking.privateGuide ? 'Yes' : 'No'}</p>
              </div>

              <div className="summary-box">
                <span>Meal Package</span>
                <p>{booking.mealPackage ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="payment-panel">
              <h2>Payment Method</h2>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="visa"
                  checked={payment === 'visa'}
                  onChange={() => setPayment('visa')}
                />
                Visa
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={payment === 'cash'}
                  onChange={() => setPayment('cash')}
                />
                Cash
              </label>
            </div>

            <button
              className="confirm-btn"
              onClick={confirmBooking}
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>

          <aside className="price-card">
            <h2>Price Summary</h2>

            <div className="price-row">
              <span>Price per Day</span>
              <strong>{booking.pricePerDay || 0} OMR</strong>
            </div>

            <div className="price-row">
              <span>Days</span>
              <strong>{booking.days || 1}</strong>
            </div>

            <div className="price-row">
              <span>Travelers</span>
              <strong>{booking.travelers || 1}</strong>
            </div>

            <div className="price-row">
              <span>Base Total</span>
              <strong>{booking.baseTotal || 0} OMR</strong>
            </div>

            <div className="price-row">
              <span>Private Tour Guide</span>
              <strong>{booking.guideFee || 0} OMR</strong>
            </div>

            <div className="price-row">
              <span>Meal Package</span>
              <strong>{booking.mealFee || 0} OMR</strong>
            </div>

            <div className="price-row total-row">
              <span>Total</span>
              <strong>{booking.total || 0} OMR</strong>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Checkout;