
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [activeSection, setActiveSection] = useState("profile");

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const emptyAddress = {
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "HOME",
    defaultAddress: false,
  };

  const [formData, setFormData] = useState(emptyAddress);

  // Load customer addresses
  const fetchAddresses = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        `/api/addresses/user/${user.id}`
      );

      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "addresses" && user?.id) {
      fetchAddresses();
    }
  }, [activeSection, user?.id]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open add address form
  const handleAddAddress = () => {
    setEditingAddressId(null);
    setFormData(emptyAddress);
    setError("");
    setMessage("");
    setShowAddressForm(true);
  };

  // Open edit address form
  const handleEditAddress = (address) => {
    setEditingAddressId(address.id);

    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      addressType: address.addressType || "HOME",
      defaultAddress: address.defaultAddress || false,
    });

    setError("");
    setMessage("");
    setShowAddressForm(true);
  };

  // Save or update address
  const handleSubmitAddress = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const payload = {
        userId: user.id,
        ...formData,
      };

      if (editingAddressId) {
        await api.put(
          `/api/addresses/${editingAddressId}/user/${user.id}`,
          payload
        );

        setMessage("Address updated successfully.");
      } else {
        await api.post("/api/addresses", payload);

        setMessage("Address added successfully.");
      }

      setShowAddressForm(false);
      setEditingAddressId(null);
      setFormData(emptyAddress);

      await fetchAddresses();
    } catch (err) {
      setError(err.message || "Unable to save address.");
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(
        `/api/addresses/${addressId}/user/${user.id}`
      );

      setMessage("Address deleted successfully.");

      await fetchAddresses();
    } catch (err) {
      setError(err.message || "Unable to delete address.");
    }
  };

  // Set default address
  const handleSetDefault = async (addressId) => {
    try {
      setError("");
      setMessage("");

      await api.put(
        `/api/addresses/${addressId}/user/${user.id}/default`,
        {}
      );

      setMessage("Default address updated successfully.");

      await fetchAddresses();
    } catch (err) {
      setError(err.message || "Unable to update default address.");
    }
  };

  // Not logged in
  if (!user) {
    return (
      <main className="customer-account">
        <div className="account-login-message">
          <h2>Please sign in to your account</h2>

          <Link to="/login" className="account-primary-btn">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  // =====================================
  // ADMIN PROFILE
  // =====================================

  if (user.role === "ADMIN") {
    return (
      <main className="customer-account">

        <div className="account-breadcrumb">
          <Link to="/">Home</Link> / Admin Profile
        </div>

        <div className="account-layout">

          {/* Admin Sidebar */}
          <aside className="account-sidebar">

            <div className="account-user-summary">
              <div className="account-avatar">
                {(user.name || "A").charAt(0).toUpperCase()}
              </div>

              <div>
                <p>Hello,</p>
                <h3>{user.name || "Admin"}</h3>
              </div>
            </div>

            <div className="account-menu">

              <p className="account-menu-heading">
                ADMIN ACCOUNT
              </p>

              <div className="account-menu-item active">
                <span>👤</span>
                Admin Profile
                <span className="menu-arrow">›</span>
              </div>

              <button
                type="button"
                className="account-menu-item logout-item"
                onClick={handleLogout}
              >
                <span>↪</span>
                Logout
              </button>

            </div>
          </aside>

          {/* Admin Content */}
          <section className="account-content">

            <div className="account-content-heading">
              <div>
                <h1>Admin Profile</h1>
                <p>
                  View your administrator account information.
                </p>
              </div>

              <span className="account-role">
                ADMIN
              </span>
            </div>

            <div className="account-info-card">

              <h2>Personal Information</h2>

              <div className="account-info-grid">

                <div className="account-info-field">
                  <label>Full Name</label>
                  <p>{user.name || "Not provided"}</p>
                </div>

                <div className="account-info-field">
                  <label>Email Address</label>
                  <p>{user.email || "Not provided"}</p>
                </div>

                <div className="account-info-field">
                  <label>Account Type</label>
                  <p>ADMIN</p>
                </div>

              </div>
            </div>

            <div className="account-info-card">

              <h2>Store Administration</h2>

              <p className="account-muted">
                Manage products, inventory and customer orders
                from your admin dashboard.
              </p>

              <Link
                to="/admin"
                className="account-primary-btn"
              >
                Go to Admin Dashboard
              </Link>

            </div>

          </section>
        </div>
      </main>
    );
  }

  // =====================================
  // CUSTOMER PROFILE
  // =====================================

  const menuItems = [
    { id: "profile", label: "My Profile", icon: "👤" },
    { id: "orders", label: "My Orders", icon: "📦" },
    { id: "addresses", label: "My Addresses", icon: "📍" },
    { id: "security", label: "Account Security", icon: "🔒" },
  ];

  return (
    <main className="customer-account">

      <div className="account-breadcrumb">
        <Link to="/">Home</Link> / My Account
      </div>

      <div className="account-layout">

        {/* CUSTOMER SIDEBAR */}
        <aside className="account-sidebar">

          <div className="account-user-summary">

            <div className="account-avatar">
              {(user.name || "C").charAt(0).toUpperCase()}
            </div>

            <div>
              <p>Hello,</p>
              <h3>{user.name}</h3>
            </div>

          </div>

          <div className="account-menu">

            <p className="account-menu-heading">
              MY ACCOUNT
            </p>

            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`account-menu-item ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={() => {
                  if (item.id === "orders") {
                    navigate("/my-orders");
                  } else {
                    setActiveSection(item.id);
                  }
                }}
              >
                <span>{item.icon}</span>

                {item.label}

                {activeSection === item.id && (
                  <span className="menu-arrow">›</span>
                )}
              </button>
            ))}

            <Link
              to="/cart"
              className="account-menu-item"
            >
              <span>🛒</span> My Cart
            </Link>

            <button
              type="button"
              className="account-menu-item logout-item"
              onClick={handleLogout}
            >
              <span>↪</span> Logout
            </button>

          </div>
        </aside>

        {/* CUSTOMER MAIN CONTENT */}
        <section className="account-content">

          {/* PROFILE SECTION */}
          {activeSection === "profile" && (
            <>

              <div className="account-content-heading">

                <div>
                  <h1>My Profile</h1>
                  <p>View your personal information.</p>
                </div>

                <span className="account-role">
                  {user.role || "CUSTOMER"}
                </span>

              </div>

              <div className="account-info-card">

                <h2>Personal Information</h2>

                <div className="account-info-grid">

                  <div className="account-info-field">
                    <label>Full Name</label>
                    <p>{user.name}</p>
                  </div>

                  <div className="account-info-field">
                    <label>Email Address</label>
                    <p>{user.email}</p>
                  </div>

                 

                </div>
              </div>

              <div className="account-info-card">

                <h2>Shopping with Aura Textile</h2>

                <p className="account-muted">
                  Manage your orders, delivery addresses and
                  account details.
                </p>

                <Link
                  to="/products"
                  className="account-primary-btn"
                >
                  Continue Shopping
                </Link>

              </div>

            </>
          )}

          {/* ADDRESS SECTION */}
          {activeSection === "addresses" && (
            <>

              <div className="account-content-heading">

                <div>
                  <h1>My Addresses</h1>
                  <p>Manage your saved delivery addresses.</p>
                </div>

                {!showAddressForm && (
                  <button
                    type="button"
                    className="account-primary-btn"
                    onClick={handleAddAddress}
                  >
                    + Add Address
                  </button>
                )}

              </div>

              {message && (
                <p className="address-success-message">
                  {message}
                </p>
              )}

              {error && (
                <p className="address-error-message">
                  {error}
                </p>
              )}

              {/* ADD / EDIT ADDRESS FORM */}
              {showAddressForm && (
                <div className="account-info-card address-form-card">

                  <h2>
                    {editingAddressId
                      ? "Edit Delivery Address"
                      : "Add New Address"}
                  </h2>

                  <form onSubmit={handleSubmitAddress}>

                    <div className="address-form-grid">

                      <div className="address-form-field">
                        <label>Full Name</label>

                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="address-form-field">
                        <label>Phone Number</label>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          pattern="[0-9]{10}"
                          maxLength="10"
                          required
                        />
                      </div>

                      <div className="address-form-field full-width">
                        <label>Address</label>

                        <textarea
                          name="addressLine"
                          value={formData.addressLine}
                          onChange={handleInputChange}
                          rows="3"
                          required
                        />
                      </div>

                      <div className="address-form-field">
                        <label>City</label>

                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="address-form-field">
                        <label>State</label>

                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="address-form-field">
                        <label>Pincode</label>

                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          pattern="[0-9]{6}"
                          maxLength="6"
                          required
                        />
                      </div>

                      <div className="address-form-field">
                        <label>Address Type</label>

                        <select
                          name="addressType"
                          value={formData.addressType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="HOME">Home</option>
                          <option value="WORK">Work</option>
                        </select>
                      </div>

                    </div>

                    <label className="address-default-checkbox">

                      <input
                        type="checkbox"
                        name="defaultAddress"
                        checked={formData.defaultAddress}
                        onChange={handleInputChange}
                      />

                      Set as default delivery address

                    </label>

                    <div className="address-form-actions">

                      <button
                        type="submit"
                        className="account-primary-btn"
                      >
                        {editingAddressId
                          ? "Update Address"
                          : "Save Address"}
                      </button>

                      <button
                        type="button"
                        className="address-cancel-btn"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                          setFormData(emptyAddress);
                        }}
                      >
                        Cancel
                      </button>

                    </div>

                  </form>
                </div>
              )}

              {/* ADDRESS LIST */}
              {loading ? (
                <div className="account-info-card">
                  <p>Loading addresses...</p>
                </div>
              ) : addresses.length === 0 && !showAddressForm ? (
                <div className="account-info-card address-empty">

                  <h2>No Saved Addresses</h2>

                  <p className="account-muted">
                    Add your delivery address to make future
                    orders easier.
                  </p>

                  <button
                    type="button"
                    className="account-primary-btn"
                    onClick={handleAddAddress}
                  >
                    Add Your First Address
                  </button>

                </div>
              ) : (
                <div className="address-list">

                  {addresses.map((address) => (
                    <div
                      className="account-info-card address-card"
                      key={address.id}
                    >

                      <div className="address-card-heading">
                        <div>

                          <h2>{address.addressType}</h2>

                          {address.defaultAddress && (
                            <span className="default-address-badge">
                              Default Address
                            </span>
                          )}

                        </div>
                      </div>

                      <h3>{address.fullName}</h3>
                      <p>{address.phone}</p>
                      <p>{address.addressLine}</p>

                      <p>
                        {address.city}, {address.state} - {address.pincode}
                      </p>

                      <div className="address-card-actions">

                        <button
                          type="button"
                          className="address-action-btn"
                          onClick={() => handleEditAddress(address)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="address-delete-btn"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          Delete
                        </button>

                        {!address.defaultAddress && (
                          <button
                            type="button"
                            className="address-action-btn"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Set as Default
                          </button>
                        )}

                      </div>
                    </div>
                  ))}

                </div>
              )}

            </>
          )}

          {/* SECURITY SECTION */}
          {activeSection === "security" && (
            <div className="account-info-card">

              <h1>Account Security</h1>

              <p className="account-muted">
                Your account is signed in as {user.email}.
              </p>

              <p>
                Password change functionality has not been implemented yet.
              </p>

            </div>
          )}

        </section>
      </div>
    </main>
  );
}

export default Profile;
