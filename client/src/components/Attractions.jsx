import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Attractions() {
  const [query, setQuery] = useState('');
  const [sites, setSites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://saffar-oman.onrender.com/api/sites')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSites(data.sites);
        }
      })
      .catch((error) => console.log('Error fetching sites:', error));
  }, []);

  const filtered = useMemo(() => {
    return sites.filter(
      (site) =>
        site.title?.toLowerCase().includes(query.toLowerCase()) ||
        site.location?.toLowerCase().includes(query.toLowerCase()) ||
        site.description?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, sites]);

  const handleBooking = async (site) => {
    try {
      await fetch(`http://localhost:3002/api/sites/${site._id}/click`, {
        method: 'PUT',
      });
    } catch (error) {
      console.log(error);
    }

    navigate('/booking', {
      state: {
        destination: site.title,
        site,
      },
    });
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        .attractions-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
        }

        .attractions-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .back-btn {
          width: 45px;
          height: 45px;
          border: none;
          border-radius: 50%;
          background: #e5d2c1;
          color: #5c4033;
          font-size: 26px;
          cursor: pointer;
        }

        .page-title {
          margin: 0;
          font-size: 38px;
          color: #5c4033;
        }

        .search-box {
          width: 100%;
          height: 62px;
          background: #e5d2c1;
          border-radius: 18px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          margin-bottom: 35px;
          gap: 12px;
        }

        .search-icon {
          color: #7a6556;
          font-size: 22px;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 16px;
          color: #5c4033;
        }

        .search-box input::placeholder {
          color: #7a6556;
        }

        .attractions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .place-card {
          background: #e5d2c1;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
        }

        .place-card img {
          width: 100%;
          height: 260px;
          object-fit: cover;
          display: block;
        }

        .place-content {
          padding: 22px;
          text-align: center;
        }

        .place-content h2 {
          margin: 0 0 8px;
          color: #5c4033;
          font-size: 24px;
          font-weight: 600;
        }

        .place-location {
          margin: 0 0 10px;
          color: #7a6556;
          font-size: 15px;
        }

        .place-description {
          color: #7a6556;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px;
          min-height: 45px;
        }

        .booking-btn {
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 16px;
          background: #f3c98b;
          color: #2f2118;
          font-size: 16px;
          cursor: pointer;
          transition: 0.2s;
        }

        .booking-btn:hover {
          background: #edbd73;
        }

        .empty-message {
          grid-column: 1 / -1;
          background: #e5d2c1;
          padding: 35px;
          border-radius: 22px;
          text-align: center;
          color: #7a6556;
        }

        @media (max-width: 1100px) {
          .attractions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .attractions-page {
            padding: 25px 18px;
          }

          .attractions-navbar {
            align-items: flex-start;
          }

          .page-title {
            font-size: 30px;
          }

          .attractions-grid {
            grid-template-columns: 1fr;
          }

          .place-card img {
            height: 230px;
          }
        }
      `}</style>

      <section className="attractions-page">
        <nav className="attractions-navbar">
          <div className="header-left">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              ‹
            </button>

            <h1 className="page-title">Attractions</h1>
          </div>
        </nav>

        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for attractions"
          />
        </div>

        <div className="attractions-grid">
          {filtered.length > 0 ? (
            filtered.map((site) => (
              <article key={site._id} className="place-card">
                <img src={site.image} alt={site.title} />

                <div className="place-content">
                  <h2>{site.title}</h2>

                  <p className="place-location">{site.location}</p>

                  <p className="place-description">
                    {site.description}
                  </p>

                  <button
                    type="button"
                    className="booking-btn"
                    onClick={() => handleBooking(site)}
                  >
                    Select for Booking
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-message">
              No attractions found
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Attractions;
