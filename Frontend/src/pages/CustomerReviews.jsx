
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import "../styles/CustomerReviews.css";

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Get logged-in user
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Check whether the logged-in user is an admin
  const isAdmin = String(user?.role || "").toUpperCase() === "ADMIN";

  // Load reviews from Spring Boot
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get("/api/reviews");

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load customer reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Refresh login information
  useEffect(() => {
    const refreshUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("authChanged", refreshUser);
    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("authChanged", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  // Submit customer review
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (isAdmin) {
      setError("Admin accounts cannot submit customer reviews.");
      return;
    }

    if (!user?.id) {
      setError("Please login before submitting a review.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a star rating.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/api/reviews", {
        userId: user.id,
        rating,
        comment: comment.trim(),
      });

      setMessage("Your review was submitted successfully.");
      setRating(0);
      setHoverRating(0);
      setComment("");

      await loadReviews();
    } catch (err) {
      setError(err.message || "Unable to submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // Format review date
  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="customer-reviews-page">

      {/* Page Heading */}
      <section className="reviews-hero">
        <p className="reviews-eyebrow">THE AURA EXPERIENCE</p>

        <h1>Customer Reviews</h1>

        <p>
          Discover what our customers think about their Aura Textile
          shopping experience.
        </p>
      </section>

      {/* Rating Summary */}
      <section className="reviews-summary">

        <div className="reviews-average">
          <strong>{averageRating}</strong>

          <div className="reviews-summary-stars">
            ★★★★★
          </div>

          <span>Average Customer Rating</span>
        </div>

        <div className="reviews-total">
          <strong>{reviews.length}</strong>
          <span>Customer Reviews</span>
        </div>

      </section>

      {/* Review Submission Section - Customers and Guests Only */}
      {!isAdmin && (
        <section className="review-form-section">

          <div className="review-form-heading">
            <p>SHARE YOUR EXPERIENCE</p>
            <h2>Write a Review</h2>
            <span>Your feedback helps other customers.</span>
          </div>

          {user ? (
            <form
              className="customer-review-form"
              onSubmit={handleSubmit}
            >

              <div className="review-user-info">
                Reviewing as <strong>{user.name || user.email}</strong>
              </div>

              <label>Rate Your Experience</label>

              <div className="review-star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={
                      star <= (hoverRating || rating)
                        ? "review-star active"
                        : "review-star"
                    }
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    aria-pressed={rating === star}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label htmlFor="customer-review-comment">
                Your Review
              </label>

              <textarea
                id="customer-review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Tell us about your shopping experience..."
                rows="5"
                maxLength="1000"
                required
              />

              <div className="review-character-count">
                {comment.length}/1000 characters
              </div>

              {error && (
                <p className="review-error">{error}</p>
              )}

              {message && (
                <p className="review-success">{message}</p>
              )}

              <button
                type="submit"
                className="review-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>

            </form>
          ) : (
            <div className="review-login-message">
              <p>Please login to share your experience.</p>

              <Link to="/login" className="review-login-btn">
                Login to Write a Review
              </Link>
            </div>
          )}

        </section>
      )}

      {/* Customer Review List */}
      <section className="customer-review-list">

        <div className="review-list-heading">
          <div>
            <p>REAL EXPERIENCES</p>
            <h2>What Our Customers Say</h2>
          </div>

          <span>{reviews.length} Reviews</span>
        </div>

        {loading && (
          <p className="review-status">
            Loading customer reviews...
          </p>
        )}

        {!loading && error && reviews.length === 0 && (
          <p className="review-status review-error">
            {error}
          </p>
        )}

        {!loading && reviews.length === 0 && !error && (
          <div className="empty-reviews">
            <h3>No reviews yet</h3>
            <p>Be the first customer to share your experience.</p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="customer-reviews-grid">

            {reviews.map((review) => (
              <article
                className="customer-review-card"
                key={review.id}
              >

                <div className="customer-review-top">
                  <div className="customer-review-avatar">
                    {(review.customerName || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="customer-review-details">
                    <h3>{review.customerName || "Customer"}</h3>

                    <span>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>

                <div
                  className="customer-review-stars"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {"★".repeat(Number(review.rating))}
                  <span>
                    {"★".repeat(5 - Number(review.rating))}
                  </span>
                </div>

                <p className="customer-review-comment">
                  {review.comment}
                </p>

              </article>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default CustomerReviews;
