
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Get logged-in user safely
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  const user = getUser();

  const isAdmin =
    String(user?.role || "").toUpperCase() === "ADMIN";

  // Load actual cart from backend
  const loadCart = async () => {
    try {
      setError("");

      const currentUser = getUser();

      // Prevent admin from accessing customer cart
      if (
        String(currentUser?.role || "").toUpperCase() === "ADMIN"
      ) {
        setAccessDenied(true);
        setCartItems([]);
        return;
      }

      if (!currentUser?.id) {
        setError("Please login to view your cart.");
        return;
      }

      const data = await api.get(
        `/api/cart?userId=${currentUser.id}`
      );

      setCartItems(Array.isArray(data) ? data : []);

    } catch (err) {
      setError(err.message || "Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Update product quantity in backend
  const updateQuantity = async (item, amount) => {
    const currentUser = getUser();

    if (
      String(currentUser?.role || "").toUpperCase() === "ADMIN"
    ) {
      setError("Admin accounts cannot manage shopping carts.");
      return;
    }

    if (!currentUser?.id) {
      setError("Please login to update your cart.");
      return;
    }

    const currentQuantity = Number(item.quantityMetres);
    const newQuantity = currentQuantity + amount;

    if (newQuantity <= 0) {
      return;
    }

    try {
      setUpdatingItem(item.id);
      setError("");

      const updatedItem = await api.put(
        `/api/cart/items/${item.id}?userId=${currentUser.id}`,
        {
          quantityMetres: newQuantity,
        }
      );

      setCartItems((items) =>
        items.map((cartItem) =>
          cartItem.id === item.id ? updatedItem : cartItem
        )
      );

    } catch (err) {
      setError(err.message || "Unable to update quantity.");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Remove product from backend cart
  const removeItem = async (cartItemId) => {
    const currentUser = getUser();

    if (
      String(currentUser?.role || "").toUpperCase() === "ADMIN"
    ) {
      setError("Admin accounts cannot manage shopping carts.");
      return;
    }

    if (!currentUser?.id) {
      setError("Please login to remove cart items.");
      return;
    }

    try {
      setUpdatingItem(cartItemId);
      setError("");

      await api.delete(
        `/api/cart/items/${cartItemId}?userId=${currentUser.id}`
      );

      setCartItems((items) =>
        items.filter((item) => item.id !== cartItemId)
      );

    } catch (err) {
      setError(err.message || "Unable to remove product.");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Calculate subtotal
  const totalAmount = cartItems.reduce((total, item) => {
    const price = Number(item.product?.pricePerMetre || 0);
    const quantity = Number(item.quantityMetres || 0);

    return total + price * quantity;
  }, 0);

  // Calculate total metres
  const totalQuantity = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantityMetres || 0),
    0
  );

  const formatPrice = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <main className="cart-page">

      {/* Heading */}
      <header className="cart-heading">
        <p>YOUR SHOPPING BAG</p>
        <h1>Shopping Cart</h1>
        <span>
          Review your selected textiles before checkout.
        </span>
      </header>

      {/* Loading */}
      {loading && (
        <section className="empty-cart">
          <p>Loading your cart...</p>
        </section>
      )}

      {/* Admin Restriction */}
      {!loading && isAdmin && (
        <section className="empty-cart">
          <h2>Shopping Cart Not Available</h2>

          <p>
            Admin accounts can view and manage products,
            but cannot add products to a shopping cart
            or place orders.
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Browse Products
          </Link>
        </section>
      )}

      {/* Error */}
      {!loading && !isAdmin && error && (
        <section className="empty-cart">
          <h2>Unable to load your cart</h2>
          <p>{error}</p>

          <button type="button" onClick={loadCart}>
            Try Again
          </button>
        </section>
      )}

      {/* Empty Cart */}
      {!loading &&
        !isAdmin &&
        !error &&
        cartItems.length === 0 && (
          <section className="empty-cart">
            <div className="empty-cart-icon">🛍</div>

            <h2>Your cart is empty</h2>

            <p>
              Explore our collection and find something you love.
            </p>

            <Link
              to="/products"
              className="continue-shopping"
            >
              Continue Shopping
            </Link>
          </section>
        )}

      {/* Cart Products */}
      {!loading &&
        !isAdmin &&
        !error &&
        cartItems.length > 0 && (
          <section className="cart-layout">

            <div className="cart-items">

              {cartItems.map((item) => {
                const product = item.product || {};

                const quantity = Number(
                  item.quantityMetres || 0
                );

                const price = Number(
                  product.pricePerMetre || 0
                );

                const lineTotal = price * quantity;

                return (
                  <article
                    className="cart-item"
                    key={item.id}
                  >

                    {/* Product Image */}
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name || "Product"}
                      />
                    ) : (
                      <div className="cart-product-placeholder">
                        No Image
                      </div>
                    )}

                    {/* Product Information */}
                    <div className="cart-item-info">

                      <span>
                        {product.material ||
                          product.category?.name ||
                          "Textile"}
                      </span>

                      <h2>{product.name}</h2>

                      <strong>
                        ₹{formatPrice(price)} / metre
                      </strong>

                      {/* Quantity Controls */}
                      <div className="cart-item-actions">

                        <div className="cart-quantity">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item, -1)
                            }
                            disabled={
                              updatingItem === item.id ||
                              quantity <= 1
                            }
                            aria-label={`Decrease ${product.name} quantity`}
                          >
                            −
                          </button>

                          <span>
                            {quantity.toLocaleString("en-IN")} m
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item, 1)
                            }
                            disabled={updatingItem === item.id}
                            aria-label={`Increase ${product.name} quantity`}
                          >
                            +
                          </button>

                        </div>

                        <button
                          type="button"
                          className="remove-item"
                          onClick={() => removeItem(item.id)}
                          disabled={updatingItem === item.id}
                        >
                          {updatingItem === item.id
                            ? "Please wait..."
                            : "Remove"}
                        </button>

                      </div>
                    </div>

                    {/* Product Total */}
                    <strong className="cart-line-total">
                      ₹{formatPrice(lineTotal)}
                    </strong>

                  </article>
                );
              })}

            </div>

            {/* Order Summary */}
            <aside className="cart-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>
                  Total Quantity ({totalQuantity} metres)
                </span>

                <span>
                  ₹{formatPrice(totalAmount)}
                </span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-total">
                <span>Subtotal</span>

                <strong>
                  ₹{formatPrice(totalAmount)}
                </strong>
              </div>

              <Link
                to="/checkout"
                className="checkout-button"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="back-to-shop"
              >
                Continue Shopping
              </Link>

            </aside>

          </section>
        )}

    </main>
  );
}

export default Cart;
