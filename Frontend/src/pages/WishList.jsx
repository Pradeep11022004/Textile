
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/WishList.css";

function Wishlist() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  // Get logged-in user
  useEffect(() => {
    const refreshUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setUser(null);
      }
    };

    refreshUser();

    window.addEventListener("authChanged", refreshUser);

    return () => {
      window.removeEventListener("authChanged", refreshUser);
    };
  }, []);

  // Load wishlist from backend
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    if (user.role !== "CUSTOMER") {
      setWishlist([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.wishlist.get(user.id);

        if (!cancelled) {
          setWishlist(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load wishlist.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Remove product from wishlist
  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);

      await api.wishlist.remove(user.id, productId);

      setWishlist((current) =>
        current.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      alert(err.message || "Unable to remove product.");
    } finally {
      setRemovingId(null);
    }
  };

  // Navigate to product details
  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Not logged in
  if (!user) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-empty">
          <h1>Your Wishlist</h1>
          <p>Please login to view your saved products.</p>
          <button onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </main>
    );
  }

  // Admin account
  if (user.role !== "CUSTOMER") {
    return (
      <main className="wishlist-page">
        <div className="wishlist-empty">
          <h1>Wishlist</h1>
          <p>Wishlist is available for customer accounts only.</p>
          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">

      {/* Heading */}
      <section className="wishlist-heading">
        <p className="wishlist-eyebrow">YOUR COLLECTION</p>
        <h1>My Wishlist</h1>
        <p>Your favourite textiles, saved in one place.</p>
      </section>

      {/* Loading */}
      {loading && (
        <p className="wishlist-message">
          Loading your wishlist...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="wishlist-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty Wishlist */}
      {!loading && !error && wishlist.length === 0 && (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>
            You haven't saved any products yet.
            Explore our collection and save your favourites.
          </p>
          <button onClick={() => navigate("/products")}>
            Explore Products
          </button>
        </div>
      )}

      {/* Wishlist Products */}
      {!loading && !error && wishlist.length > 0 && (
        <>
          <div className="wishlist-count">
            {wishlist.length} saved{" "}
            {wishlist.length === 1 ? "product" : "products"}
          </div>

          <section className="wishlist-grid">
            {wishlist.map((item) => {
              const stock = Number(item.stockMetres || 0);
              const price = Number(item.pricePerMetre || 0);
              const isAvailable = stock > 0;

              return (
                <article
                  className="wishlist-card"
                  key={item.wishlistId}
                >
                  <div className="wishlist-image-wrapper">
                    <img
                      src={
                        item.imageUrl ||
                        "/images/product-placeholder.png"
                      }
                      alt={item.productName}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "/images/product-placeholder.png";
                      }}
                    />

                    <span
                      className={
                        isAvailable
                          ? "wishlist-stock"
                          : "wishlist-stock unavailable"
                      }
                    >
                      {isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="wishlist-card-info">
                    <span className="wishlist-category">
                      {item.categoryName || item.material || "Textile"}
                    </span>

                    <h2>{item.productName}</h2>

                    <p className="wishlist-material">
                      {item.material || "Material not specified"}
                      {item.color ? ` • ${item.color}` : ""}
                    </p>

                    <div className="wishlist-price">
                      ₹{price.toLocaleString("en-IN")} / metre
                    </div>

                    <p className="wishlist-stock-quantity">
                      {isAvailable
                        ? `${stock.toLocaleString("en-IN")} metres available`
                        : "Currently unavailable"}
                    </p>

                    <div className="wishlist-actions">
                      <button
                        type="button"
                        className="wishlist-view-button"
                        onClick={() =>
                          handleViewDetails(item.productId)
                        }
                      >
                        View Item
                      </button>

                      <button
                        type="button"
                        className="wishlist-remove-button"
                        disabled={removingId === item.productId}
                        onClick={() =>
                          handleRemove(item.productId)
                        }
                      >
                        {removingId === item.productId
                          ? "Removing..."
                          : "Remove ♡"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

    </main>
  );
}

export default Wishlist;
