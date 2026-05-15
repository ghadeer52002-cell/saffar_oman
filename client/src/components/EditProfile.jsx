import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../features/UserSlice';

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImage: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [feedback, setFeedback] = useState({
    comment: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setForm({
      fullName: user.fullName || user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      profileImage: user.profileImage || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [user, navigate]);

  if (!user) return null;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const updateProfile = async () => {
    setMessage('');
    setError('');

    if (!form.fullName || !form.email) {
      setError('Full name and email are required.');
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/api/profile/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          profileImage: form.profileImage,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Could not update profile.');
        return;
      }

      dispatch(updateUserData(data.user));
      setMessage('Profile updated successfully.');

      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const submitFeedback = async () => {
    setFeedbackMessage('');
    setError('');

    if (!feedback.comment.trim()) {
      setError('Please write your feedback.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          userName: form.fullName,
          userEmail: form.email,
          userProfileImage: form.profileImage,
          comment: feedback.comment,
          
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Could not add feedback.');
        return;
      }

      setFeedback({
        comment: '',
      });

      setFeedbackMessage('Feedback added successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <style>{`
        .profile-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
          color: #5c4033;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .profile-header h1 {
          margin: 0;
          font-size: 58px;
        }

        .profile-header p {
          margin-top: 10px;
          color: #7a6556;
          font-size: 20px;
        }

        .back-btn {
          border: none;
          background: #e5d2c1;
          color: #5c4033;
          padding: 14px 22px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 15px;
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 30px;
          align-items: start;
        }

        .profile-card,
        .form-card {
          background: #eadccd;
          border-radius: 35px;
          padding: 35px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.08);
        }

        .profile-card {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 620px;
        }

        .profile-preview {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .profile-image,
        .profile-placeholder {
          width: 230px;
          height: 230px;
          border-radius: 50%;
          border: 7px solid #f4ece3;
          margin-bottom: 25px;
        }

        .profile-image {
          object-fit: cover;
        }

        .profile-placeholder {
          background: #5c4033;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          font-weight: bold;
        }

        .profile-preview h2 {
          margin: 0;
          font-size: 50px;
          color: #5c4033;
        }

        .profile-preview p {
          margin-top: 12px;
          color: #7a6556;
          font-size: 22px;
        }

        .upload-label,
        .feedback-btn,
        .save-btn {
          border: none;
          background: #5c4033;
          color: white;
          border-radius: 20px;
          cursor: pointer;
          font-size: 17px;
        }

        .upload-label {
          display: inline-flex;
          margin-top: 28px;
          padding: 16px 24px;
        }

        .upload-label input {
          display: none;
        }

        .form-card h2 {
          margin: 0 0 28px;
          font-size: 38px;
          color: #5c4033;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group label {
          font-weight: 600;
          color: #5c4033;
          font-size: 16px;
        }

        .form-group input,
        .form-group textarea {
          border-radius: 18px;
          border: 1px solid #d9c7b7;
          padding: 0 16px;
          font-size: 15px;
          outline: none;
          color: #5c4033;
          background: white;
          font-family: Arial, sans-serif;
        }

        .form-group input {
          height: 58px;
        }

        .form-group textarea {
          padding-top: 15px;
          min-height: 150px;
          resize: vertical;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .password-title,
        .feedback-title {
          margin: 35px 0 18px;
          font-size: 28px;
          color: #5c4033;
        }

        .save-btn,
        .feedback-btn {
          width: 100%;
          height: 60px;
          margin-top: 28px;
        }

        .success-box {
          background: #e8f7e8;
          color: #1f7a1f;
          padding: 14px;
          border-radius: 16px;
          margin-bottom: 20px;
        }

        .error-box {
          background: #ffe7e7;
          color: #b42318;
          padding: 14px;
          border-radius: 16px;
          margin-bottom: 20px;
        }

        @media (max-width: 950px) {
          .profile-page {
            padding: 25px 18px;
          }

          .profile-layout,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .profile-card {
            min-height: auto;
          }
        }
      `}</style>

      <section className="profile-page">
        <div className="profile-header">
          <div>
            <h1>Edit Profile</h1>
            <p>Update your personal details, profile picture, and feedback.</p>
          </div>

          <button className="back-btn" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>

        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-preview">
              {form.profileImage ? (
                <img className="profile-image" src={form.profileImage} alt="Profile" />
              ) : (
                <div className="profile-placeholder">
                  {form.fullName ? form.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              <h2>{form.fullName || 'User Name'}</h2>
              <p>{form.email}</p>
              <p>{form.phone || 'No phone added'}</p>

              <label className="upload-label">
                Upload Profile Image
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div className="form-card">
            <h2>Profile Information</h2>

            {message && <div className="success-box">{message}</div>}
            {feedbackMessage && <div className="success-box">{feedbackMessage}</div>}
            {error && <div className="error-box">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Full Name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone"
                />
              </div>
            </div>

            <h3 className="password-title">Reset Password</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="Current Password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="New Password"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm New Password"
                />
              </div>
            </div>

            <button className="save-btn" onClick={updateProfile}>
              Save Changes
            </button>

            <h3 className="feedback-title">✍ Add Feedback</h3>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Your Feedback</label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                  placeholder="Write your feedback about Saffar Oman..."
                />
              </div>
            </div>

            <button className="feedback-btn" onClick={submitFeedback}>
              Submit Feedback
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditProfile;