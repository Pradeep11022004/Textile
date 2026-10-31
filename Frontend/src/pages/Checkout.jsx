
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin =
    String(user?.role || "").toUpperCase() === "ADMIN";

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "HOME",
    defaultAddress: false,
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [message, setMessage] = useState("");

  // Load cart and saved addresses
  useEffect(() => {
    const loadCheckoutData = async () => {

      // Prevent admin checkout access
      if (isAdmin) {
        setMessage(
          "Admin accounts cannot access customer checkout."
        );
        setLoading(false);
        return;
      }

      if (!user?.id) {
        setMessage("Please login before checkout.");
        setLoading(false);
        return;
      }

      try {
        setMessage("");

        const [cartData, addressData] = await Promise.all([
          api.get(`/api/cart?userId=${user.id}`),
          api.get(`/api/addresses/user/${user.id}`),
        ]);

        setCartItems(Array.isArray(cartData) ? cartData : []);

        const savedAddresses = Array.isArray(addressData)
          ? addressData
          : [];

        setAddresses(savedAddresses);

        const defaultAddress = savedAddresses.find(
          (address) => address.defaultAddress
        );

        const selectedAddress =
          defaultAddress || savedAddresses[0];

        if (selectedAddress) {
          setSelectedAddressId(String(selectedAddress.id));
        } else {
          setShowAddressForm(true);
        }

      } catch (error) {
        setMessage(
          error.message || "Unable to load checkout information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, []);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(item.product?.pricePerMetre || 0);
    const quantity = Number(item.quantityMetres || 0);

    return total + price * quantity;
  }, 0);

  // Handle new address form
  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;

    setNewAddress((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save new address to customer profile
  const handleSaveAddress = async (event) => {
    event.preventDefault();

    if (isAdmin) {
      setMessage("Admin accounts cannot save checkout addresses.");
      return;
    }

    if (!user?.id) {
      setMessage("Please login before saving an address.");
      return;
    }

    try {
      setSavingAddress(true);
      setMessage("");

      const payload = {
        userId: user.id,
        ...newAddress,
      };

      const savedAddress = await api.post(
        "/api/addresses",
        payload
      );

      // Reload saved addresses
      const updatedAddresses = await api.get(
        `/api/addresses/user/${user.id}`
      );

      setAddresses(
        Array.isArray(updatedAddresses) ? updatedAddresses : []
      );

      setSelectedAddressId(String(savedAddress.id));
      setShowAddressForm(false);

      setNewAddress({
        fullName: user?.name || "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "HOME",
        defaultAddress: false,
      });

      setMessage("Address saved successfully.");

    } catch (error) {
      setMessage(error.message || "Unable to save address.");
    } finally {
      setSavingAddress(false);
    }
  };

  // Place order
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent admin from placing orders
    if (isAdmin) {
      setMessage("Admin accounts cannot place orders.");
      return;
    }

    try {
      setMessage("");

      if (!user?.id) {
        setMessage("Please login before placing your order.");
        return;
      }

      if (cartItems.length === 0) {
        setMessage("Your cart is empty.");
        return;
      }

      if (paymentMethod === "ONLINE") {
        setMessage(
          "Online payment is not integrated yet. Please select Cash on Delivery."
        );
        return;
      }

      const selectedAddress = addresses.find(
        (address) =>
          String(address.id) === String(selectedAddressId)
      );

      if (!selectedAddress) {
        setMessage("Please select a delivery address.");
        return;
      }

      setPlacingOrder(true);

      const shippingAddress = [
        selectedAddress.fullName,
        selectedAddress.phone,
        selectedAddress.addressLine,
        selectedAddress.city,
        selectedAddress.state,
        selectedAddress.pincode,
      ].join(", ");

      const response = await api.post(
        `/api/orders?userId=${user.id}`,
        {
          shippingAddress,
          paymentMethod,
        }
      );

      navigate("/order-success", {
        replace: true,
        state: {
          order: response,
        },
      });

    } catch (error) {
      setMessage(
        error.message || "Unable to place your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="checkout-page">

      <header className="checkout-heading">
        <p>ALMOST YOURS</p>
        <h1>Checkout</h1>
        <span>Confirm your delivery details to continue.</span>
      </header>

      {/* ADMIN CHECKOUT RESTRICTION */}
      {isAdmin ? (
        <section className="checkout-section">
          <h2>Checkout Not Available</h2>

          <p>
            Admin accounts can manage products and orders,
            but cannot purchase products.
          </p>

          <Link to="/products">
            Continue Browsing Products
          </Link>
        </section>
      ) : loading ? (
        <p>Loading checkout information...</p>
      ) : (
        <div className="checkout-layout">

          <form className="checkout-form" onSubmit={handleSubmit}>

            {/* DELIVERY ADDRESS */}
            <section className="checkout-section">

              <div className="checkout-address-heading">
                <h2>Delivery Address</h2>

                {!showAddressForm && (
                  <button
                    type="button"
                    className="checkout-add-address-btn"
                    onClick={() => setShowAddressForm(true)}
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {/* SAVED ADDRESSES */}
              {!showAddressForm && addresses.length > 0 && (
                <div className="checkout-address-list">

                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`checkout-address-card ${
                        String(selectedAddressId) === String(address.id)
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        value={address.id}
                        checked={
                          String(selectedAddressId) ===
                          String(address.id)
                        }
                        onChange={() =>
                          setSelectedAddressId(String(address.id))
                        }
                      />

                      <div className="checkout-address-details">

                        <div className="checkout-address-title">
                          <strong>{address.fullName}</strong>

                          <span className="checkout-address-type">
                            {address.addressType}
                          </span>

                          {address.defaultAddress && (
                            <span className="checkout-default-badge">
                              Default
                            </span>
                          )}
                        </div>

                        <p>{address.phone}</p>
                        <p>{address.addressLine}</p>

                        <p>
                          {address.city}, {address.state} -{" "}
                          {address.pincode}
                        </p>

                      </div>
                    </label>
                  ))}

                </div>
              )}

              {/* NO SAVED ADDRESS */}
              {!showAddressForm && addresses.length === 0 && (
                <p className="checkout-empty-address">
                  No saved addresses. Please add a delivery address.
                </p>
              )}

              {/* ADD NEW ADDRESS FORM */}
              {showAddressForm && (
                <div className="checkout-new-address">

                  <h3>Add New Delivery Address</h3>

                  <div className="checkout-field">
                    <label>Full Name</label>

                    <input
                      type="text"
                      name="fullName"
                      value={newAddress.fullName}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="checkout-two-columns">

                    <div className="checkout-field">
                      <label>Phone Number</label>

                      <input
                        type="tel"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                      />
                    </div>

                    <div className="checkout-field">
                      <label>Address Type</label>

                      <select
                        name="addressType"
                        value={newAddress.addressType}
                        onChange={handleAddressChange}
                      >
                        <option value="HOME">Home</option>
                        <option value="WORK">Work</option>
                      </select>
                    </div>

                  </div>

                  <div className="checkout-field">
                    <label>Address</label>

                    <textarea
                      name="addressLine"
                      value={newAddress.addressLine}
                      onChange={handleAddressChange}
                      placeholder="House number, street, area"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="checkout-two-columns">

                    <div className="checkout-field">
                      <label>City</label>

                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>

                    <div className="checkout-field">
                      <label>State</label>

                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>

                  </div>

                  <div className="checkout-field">
                    <label>PIN Code</label>

                    <input
                      type="text"
                      name="pincode"
                      value={newAddress.pincode}
                      onChange={handleAddressChange}
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                    />
                  </div>

                  <label className="checkout-save-default">
                    <input
                      type="checkbox"
                      name="defaultAddress"
                      checked={newAddress.defaultAddress}
                      onChange={handleAddressChange}
                    />

                    Save as my default address
                  </label>

                  <div className="checkout-address-actions">

                    <button
                      type="button"
                      className="checkout-save-address-btn"
                      onClick={handleSaveAddress}
                      disabled={savingAddress}
                    >
                      {savingAddress ? "Saving..." : "Save Address"}
                    </button>

                    {addresses.length > 0 && (
                      <button
                        type="button"
                        className="checkout-cancel-address-btn"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </div>
              )}

            </section>

            {/* PAYMENT METHOD */}
            <section className="checkout-section">

              <h2>Payment Method</h2>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                />

                <span>
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives.</small>
                </span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                />

                <span>
                  <strong>Online Payment</strong>
                  <small>Payment gateway integration required.</small>
                </span>
              </label>

            </section>

            {/* PLACE ORDER */}
            <button
              type="submit"
              className="place-order-button"
              disabled={
                placingOrder ||
                cartItems.length === 0 ||
                addresses.length === 0 ||
                showAddressForm
              }
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>

            {message && (
              <p className="checkout-message" role="alert">
                {message}
              </p>
            )}

            <Link to="/cart" className="checkout-back-link">
              ← Return to Cart
            </Link>

          </form>

          {/* ORDER SUMMARY */}
          <aside className="checkout-summary">

            <h2>Your Order</h2>

            {cartItems.length === 0 ? (
              <div>
                <p>Your cart is empty.</p>
                <Link to="/products">Explore Products</Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div className="checkout-item" key={item.id}>

                  <div>

                    {item.product?.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="checkout-product-image"
                      />
                    )}

                    <strong>
                      {item.product?.name || "Product"}
                    </strong>

                    <span>
                      Quantity: {item.quantityMetres} metres
                    </span>

                    <span>
                      ₹
                      {Number(
                        item.product?.pricePerMetre || 0
                      ).toLocaleString("en-IN")} / metre
                    </span>

                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.product?.pricePerMetre || 0) *
                      Number(item.quantityMetres || 0)
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>
              ))
            )}

            <div className="checkout-total">

              <span>Subtotal</span>

              <strong>
                ₹
                {subtotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>

            </div>

            <p className="checkout-disclaimer">
              Final price and stock are verified by the backend.
            </p>

          </aside>

        </div>
      )}

    </main>
  );
}

export default Checkout;
