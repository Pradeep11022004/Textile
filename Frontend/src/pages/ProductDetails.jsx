
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin =
    String(user?.role || "").toUpperCase() === "ADMIN";

  // Load product from backend
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.get(`/api/products/${id}`);

        setProduct(data);
        setQuantity(1);
      } catch (err) {
        setError(err.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  // Add product to backend cart
  const addToCart = async () => {
    try {
      setMessage("");
      setError("");

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (!currentUser?.id) {
        setError("Please login before adding products to your cart.");
        return;
      }

      // Prevent admin from purchasing
      if (String(currentUser.role || "").toUpperCase() === "ADMIN") {
        setError("Admin accounts cannot purchase products.");
        return;
      }

      if (!product) {
        setError("Product information is unavailable.");
        return;
      }

      if (quantity <= 0 || quantity > Number(product.stockMetres)) {
        setError("Please select a valid quantity.");
        return;
      }

      setAddingToCart(true);

      await api.post(
        `/api/cart/items?userId=${currentUser.id}`,
        {
          productId: product.id,
          quantityMetres: quantity,
        }
      );

      setMessage(
        `${product.name} successfully added to your cart!`
      );

    } catch (err) {
      setError(err.message || "Unable to add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Price formatting
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Loading
  if (loading) {
    return (
      <main className="product-details-page">
        <p>Loading product details...</p>
      </main>
    );
  }

  // Error
  if (error && !product) {
    return (
      <main className="product-details-page">
        <h1>Unable to load product</h1>
        <p>{error}</p>
        <Link to="/products">Back to Products</Link>
      </main>
    );
  }

  // Product not found
  if (!product) {
    return (
      <main className="product-details-page">
        <h1>Product not found</h1>
        <Link to="/products">Back to Products</Link>
      </main>
    );
  }

  const price = Number(product.pricePerMetre || 0);
  const stock = Number(product.stockMetres || 0);
  const totalPrice = price * quantity;
  const isOutOfStock = stock <= 0;

  return (
    <main className="product-details-page">

      {/* Breadcrumb */}
      <div className="details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="details-layout">

        {/* Product Image */}
        <div className="details-image">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
            />
          ) : (
            <div className="product-image-placeholder">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="details-content">

          <p className="details-category">
            {product.category?.name || product.material || "Textile"}
          </p>

          <h1>{product.name}</h1>

          <p className="details-price">
            ₹{formatPrice(price)}
            <span> / metre</span>
          </p>

          <p className="details-description">
            {product.description || "No product description available."}
          </p>

          {/* Product Specifications */}
          <div className="details-specifications">

            <p>
              <strong>Material:</strong>{" "}
              {product.material || "Not specified"}
            </p>

            <p>
              <strong>Color:</strong>{" "}
              {product.color || "Not specified"}
            </p>

            <p>
              <strong>Availability:</strong>{" "}
              {isOutOfStock
                ? "Out of Stock"
                : `${stock} metres available`}
            </p>

          </div>

          {/* Customer Purchasing Section */}
          {!isAdmin && !isOutOfStock && (
            <>
              <div className="quantity-selector">

                <label htmlFor="quantity">
                  Quantity (Metres)
                </label>

                <div className="quantity-controls">

                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1 || addingToCart}
                    onClick={() =>
                      setQuantity((current) => current - 1)
                    }
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= stock || addingToCart}
                    onClick={() =>
                      setQuantity((current) => current + 1)
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <p className="details-total">
                Total: ₹{formatPrice(totalPrice)}
              </p>

              <button
                type="button"
                className="details-add-button"
                onClick={addToCart}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </>
          )}

          {/* Admin Message */}
          {isAdmin && (
            <p className="details-message">
              Admin View: You can view product information,
              but purchasing is not available for admin accounts.
            </p>
          )}

          {/* Out of Stock */}
          {!isAdmin && isOutOfStock && (
            <p className="details-message">
              This product is currently out of stock.
            </p>
          )}

          {/* Success Message */}
          {message && (
            <div className="details-message" role="status">
              {message}
              <br />
              <Link to="/cart">View Cart</Link>
            </div>
          )}

          {/* Error Message */}
          {error && product && (
            <p className="details-message" role="alert">
              {error}
            </p>
          )}

        </div>

      </section>
    </main>
  );
}

export default ProductDetails;
