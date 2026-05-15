import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageSites() {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    location: '',
    image: '',
    pricePerDay: '',
    description: '',
  });

  const loadSites = () => {
    fetch('http://localhost:3002/api/sites')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSites(data.sites);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadSites();
  }, []);

  const resetForm = () => {
    setEditingId(null);

    setForm({
      title: '',
      location: '',
      image: '',
      pricePerDay: '',
      description: '',
    });
  };

  const startEdit = (site) => {
    setEditingId(site._id);

    setForm({
      title: site.title || '',
      location: site.location || '',
      image: site.image || '',
      pricePerDay: site.pricePerDay || '',
      description: site.description || '',
    });
  };

  const saveSite = async () => {
    if (!form.title || !form.location || !form.image || !form.pricePerDay) {
      alert('Please fill title, location, image, and price');
      return;
    }

    if (editingId) {
      await fetch(`http://localhost:3002/api/sites/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('http://localhost:3002/api/sites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
    }

    resetForm();
    loadSites();
  };

  const deleteSite = async (id) => {
    await fetch(`http://localhost:3002/api/sites/${id}`, {
      method: 'DELETE',
    });

    loadSites();
  };

  return (
    <>
      <style>{`
        .admin-manage-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
          color: #5c4033;
        }

        .manage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .manage-header h1 {
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
        }

        .form-card {
          background: #eadccd;
          border-radius: 28px;
          padding: 24px;
          margin-bottom: 30px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .form-grid input,
        .form-grid textarea {
          border: 1px solid #d4c0af;
          border-radius: 14px;
          padding: 14px;
          outline: none;
          color: #5c4033;
          font-family: Arial, sans-serif;
        }

        .form-grid input {
          height: 48px;
        }

        .form-grid textarea {
          min-height: 110px;
          resize: vertical;
          grid-column: 1 / -1;
        }

        .save-btn {
          border: none;
          background: #5c4033;
          color: white;
          padding: 12px 18px;
          border-radius: 18px;
          cursor: pointer;
          margin-top: 15px;
        }

        .cancel-btn {
          border: none;
          background: #e5d2c1;
          color: #5c4033;
          padding: 12px 18px;
          border-radius: 18px;
          cursor: pointer;
          margin-top: 15px;
          margin-left: 10px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .site-card {
          background: #e5d2c1;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
        }

        .site-card img {
          width: 100%;
          height: 210px;
          object-fit: cover;
          display: block;
        }

        .site-body {
          padding: 20px;
        }

        .site-body h3 {
          margin: 0 0 10px;
          font-size: 23px;
        }

        .site-body p {
          margin: 7px 0;
          color: #7a6556;
          line-height: 1.5;
        }

        .price-tag {
          display: inline-block;
          background: #5c4033;
          color: white;
          padding: 8px 13px;
          border-radius: 18px;
          margin: 8px 0;
          font-size: 14px;
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
        }

        .edit-btn {
          background: #5c4033;
          color: white;
        }

        .delete-btn {
          background: #c84c4c;
          color: white;
        }

        @media (max-width: 1000px) {
          .cards-grid,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .admin-manage-page {
            padding: 25px 18px;
          }
        }
      `}</style>

      <section className="admin-manage-page">
        <div className="manage-header">
          <h1>Manage Places</h1>

          <button className="back-btn" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </button>
        </div>

        <div className="form-card">
          <div className="form-grid">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Place title"
            />

            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Location"
            />

            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="Image URL"
            />

            <input
              type="number"
              min="0"
              value={form.pricePerDay}
              onChange={(e) =>
                setForm({ ...form, pricePerDay: e.target.value })
              }
              placeholder="Price per day"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
            />
          </div>

          <button className="save-btn" onClick={saveSite}>
            {editingId ? 'Save Changes' : 'Add Place'}
          </button>

          {editingId && (
            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>

        <div className="cards-grid">
          {sites.map((site) => (
            <div key={site._id} className="site-card">
              <img src={site.image} alt={site.title} />

              <div className="site-body">
                <h3>{site.title}</h3>

                <p>{site.location}</p>

                <span className="price-tag">
                  {site.pricePerDay || 0} OMR / day
                </span>

                <p>{site.description}</p>

                <div className="card-actions">
                  <button className="edit-btn" onClick={() => startEdit(site)}>
                    Update
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteSite(site._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default ManageSites;