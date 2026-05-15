import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageReviews() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [editForm, setEditForm] = useState({
    comment: '',
    
  });

  const loadReviews = () => {
    fetch('https://saffar-oman.onrender.com/api/admin/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      });
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const timeAgo = (dateValue) => {
    const now = new Date();
    const date = new Date(dateValue);
    const diffMinutes = Math.floor((now - date) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditForm({
      comment: review.comment || '',
      
    });
  };

  const updateReview = async (id) => {
    await fetch(`https://saffar-oman.onrender.com/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editForm),
    });

    setEditingId(null);
    loadReviews();
  };

  const saveReply = async (id) => {
    await fetch(`https://saffar-oman.onrender.com/api/admin/reviews/${id}/reply`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminReply: replyText[id] || '',
      }),
    });

    setReplyText({
      ...replyText,
      [id]: '',
    });

    loadReviews();
  };

  const deleteReview = async (id) => {
    await fetch(`https://saffar-oman.onrender.com/api/admin/reviews/${id}`, {
      method: 'DELETE',
    });

    loadReviews();
  };

  return (
    <>
      <style>{`
        .reviews-page {
          min-height: 100vh;
          background: #f4ece3;
          padding: 35px 55px;
          font-family: Arial, sans-serif;
          color: #5c4033;
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .reviews-header h1 {
          margin: 0;
          font-size: 42px;
        }

        .back-btn {
          border: none;
          background: #e5d2c1;
          color: #5c4033;
          padding: 12px 18px;
          border-radius: 30px;
          cursor: pointer;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .review-card {
          background: #eadccd;
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
        }

        .review-card h3 {
          margin: 0;
          color: #5c4033;
        }

        .review-card p {
          color: #7a6556;
          line-height: 1.6;
        }

        

        .time {
          color: #7a6556;
          font-size: 13px;
          margin-top: 6px;
        }

        .review-card textarea,
        .review-card select {
          width: 100%;
          border: 1px solid #d4c0af;
          border-radius: 16px;
          padding: 12px;
          margin-top: 12px;
          outline: none;
          font-family: Arial, sans-serif;
        }

        .review-card textarea {
          min-height: 90px;
          resize: vertical;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .edit-btn,
        .delete-btn,
        .reply-btn,
        .cancel-btn {
          border: none;
          padding: 10px 14px;
          border-radius: 16px;
          cursor: pointer;
          color: white;
        }

        .edit-btn,
        .reply-btn {
          background: #5c4033;
        }

        .delete-btn {
          background: #b94a48;
        }

        .cancel-btn {
          background: #7a6556;
        }

        @media (max-width: 1000px) {
          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .reviews-page {
            padding: 25px 18px;
          }
        }
      `}</style>

      <section className="reviews-page">
        <div className="reviews-header">
          <h1>Manage Reviews</h1>

          <button className="back-btn" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </button>
        </div>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <h3>{review.userName || 'User'}</h3>

              <div className="time">
                Posted {timeAgo(review.createdAt)}
              </div>

              {review.repliedAt && (
                <div className="time">
                  Replied {timeAgo(review.repliedAt)}
                </div>
              )}

              {editingId === review._id ? (
                <>
                 

                  <textarea
                    value={editForm.comment}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        comment: e.target.value,
                      })
                    }
                  />

                  <div className="actions">
                    <button className="edit-btn" onClick={() => updateReview(review._id)}>
                      Save
                    </button>

                    <button className="cancel-btn" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  

                  <p>{review.comment}</p>

                  {review.adminReply && (
                    <p>
                      <strong>Admin Reply:</strong> {review.adminReply}
                    </p>
                  )}

                  <textarea
                    placeholder="Write admin reply..."
                    value={replyText[review._id] || ''}
                    onChange={(e) =>
                      setReplyText({
                        ...replyText,
                        [review._id]: e.target.value,
                      })
                    }
                  />

                  <div className="actions">
                    <button className="reply-btn" onClick={() => saveReply(review._id)}>
                      Reply
                    </button>

                    <button className="edit-btn" onClick={() => startEdit(review)}>
                      Update
                    </button>

                    <button className="delete-btn" onClick={() => deleteReview(review._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default ManageReviews;
