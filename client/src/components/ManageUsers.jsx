import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });

  const loadUsers = () => {

    fetch('https://saffar-oman.onrender.com/api/users')

      .then((response) => response.json())

      .then((data) => {

        if (data.success) {

          setUsers(data.users);

        }

      })

      .catch((error) => console.log(error));

  };

  useEffect(() => {

    loadUsers();

  }, []);

  const resetForm = () => {

    setEditingId(null);

    setForm({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
    });

  };

  const startEdit = (user) => {

    setEditingId(user._id);

    setForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      password: user.password || '',
      role: user.role || 'user',
    });

  };

  const saveUser = async () => {

    if (
      !form.fullName ||
      !form.email ||
      !form.password
    ) {
      return;
    }

    if (editingId) {

      await fetch(`https://saffar-oman.onrender.com/api/users/${editingId}`, {

        method: 'PUT',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(form),

      });

    } else {

      await fetch('https://saffar-oman.onrender.com/api/users/add', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(form),

      });

    }

    resetForm();

    loadUsers();

  };

  const deleteUser = async (id) => {

    await fetch(`https://saffar-oman.onrender.com/api/users/${id}`, {

      method: 'DELETE',

    });

    loadUsers();

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
          box-shadow: 0 14px 30px rgba(0,0,0,0.08);
        }

        .form-title {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 28px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
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

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .user-card {
          background: #e5d2c1;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 14px 30px rgba(0,0,0,0.08);
        }

        .user-card h3 {
          margin: 0 0 12px;
          font-size: 24px;
        }

        .user-card p {
          margin: 8px 0;
          color: #7a6556;
          line-height: 1.5;
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

        @media (max-width: 1200px) {

          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 800px) {

          .admin-manage-page {
            padding: 25px 18px;
          }

          .manage-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .form-grid,
          .cards-grid {
            grid-template-columns: 1fr;
          }

        }
      `}</style>

      <section className="admin-manage-page">

        <div className="manage-header">

          <h1>Manage Users</h1>

          <button
            className="back-btn"
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </button>

        </div>

        <div className="form-card">

          <h2 className="form-title">
            {editingId ? 'Update User' : 'Add New User'}
          </h2>

          <div className="form-grid">

            <input
              value={form.fullName}
              onChange={(e) =>
                setForm({
                  ...form,
                  fullName: e.target.value,
                })
              }
              placeholder="Full Name"
            />

            <input
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="Email"
            />

            <input
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              placeholder="Phone"
            />

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="Password"
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

          </div>

          <button
            className="save-btn"
            onClick={saveUser}
          >
            {editingId ? 'Save Changes' : 'Add User'}
          </button>

          {editingId && (

            <button
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>

          )}

        </div>

        <div className="cards-grid">

          {users.map((user) => (

            <div
              key={user._id}
              className="user-card"
            >

              <h3>{user.fullName || 'No Name'}</h3>

              <p>Email: {user.email}</p>

              <p>Phone: {user.phone || '-'}</p>

              <p>Role: {user.role || 'user'}</p>

              <div className="card-actions">

                <button
                  className="edit-btn"
                  onClick={() => startEdit(user)}
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>
    </>
  );

}

export default ManageUsers;
