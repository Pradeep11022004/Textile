
import { useEffect, useState } from "react";
import { api } from "../services/api";

function ProductCard({ product, onViewDetails }) {
  const [user, setUser] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Read and refresh logged-in user
  useEffect(() => {
    const refreshUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Invalid user data:", error);
        setUser(null);
      }
    };

    refreshUser();

    window.addEventListener("authChanged", refreshUser);
    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("authChanged", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  // Check whether product is already wishlisted
  useEffect(() => {
    setIsWishlisted(false);

    if (!user || user.role !== "CUSTOMER" || !product?.id) {
      return;
    }

    let cancelled = false;

    const checkWishlist = async () => {
      try {
        const response = await api.wishlist.check(
          user.id,
          product.id
        );

        if (!cancelled) {
          setIsWishlisted(response.exists);
        }
      } catch (error) {
        console.error("Wishlist check failed:", error);
      }
    };

    checkWishlist();

    return () => {
      cancelled = true;
    };
  }, [user, product?.id]);

  // Add or remove wishlist product
  const handleWishlist = async () => {
    if (!user) {
      alert("Please login to use your wishlist.");
      return;
    }

    if (user.role !== "CUSTOMER") {
      return;
    }

    if (wishlistLoading || !product?.id) return;

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        await api.wishlist.remove(user.id, product.id);
        setIsWishlisted(false);
      } else {
        await api.wishlist.add(user.id, product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      alert(error.message || "Unable to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  // Return only after all Hooks
  if (!product) return null;

  const stock = Number(product.stockMetres || 0);
  const price = Number(product.pricePerMetre || 0);
  const isAvailable = stock > 0;

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  return (
    <article className="product-card">

      <div className="product-image-wrapper">

        <img
          src={product.imageUrl || "/images/product-placeholder.png"}
          alt={product.name || "Textile product"}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/images/product-placeholder.png";
          }}
        />

        <span
          className={
            isAvailable
              ? "stock-badge"
              : "stock-badge out-of-stock"
          }
        >
          {isAvailable ? "In Stock" : "Out of Stock"}
        </span>

        {/* Wishlist Heart */}
        {user?.role === "CUSTOMER" && (
          <button
            type="button"
            className={`wishlist-button ${
              isWishlisted ? "active" : ""
            }`}
            onClick={handleWishlist}
            disabled={wishlistLoading}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            title={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        )}

      </div>

      <div className="product-info">

        <span className="product-category">
          {categoryName || product.material || "Textile"}
        </span>

        <h2>{product.name || "Unnamed Product"}</h2>

        <div className="product-bottom">

          <div>
            <strong>
              ₹{price.toLocaleString("en-IN")}
            </strong>

            <span className="price-unit"> / metre</span>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleViewDetails}
          >
            {isAvailable ? "View Item" : "Unavailable"}
          </button>

        </div>

        <p className="stock-quantity">
          {isAvailable
            ? `${stock.toLocaleString("en-IN")} metres available`
            : "Currently unavailable"}
        </p>

      </div>
    </article>
  );
}

export default ProductCard;
