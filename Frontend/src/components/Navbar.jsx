
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Refresh user after login or logout.
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

  // Close menus when route changes.
  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Close account dropdown when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setMobileOpen(false);
  };

  // Scroll to top when Home is clicked on the Home page.
  const handleHomeClick = () => {
    closeMenus();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setMenuOpen(false);
    setMobileOpen(false);

    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  return (
    <header className="store-navbar">

      {/* Brand */}
      <Link
        to="/"
        className="store-brand"
        onClick={handleHomeClick}
      >
        <span className="store-brand-icon">A</span>
        <span>
          Aura<span className="store-brand-accent">Textile</span>
        </span>
      </Link>

      {/* Mobile menu button */}
      <button
        type="button"
        className="mobile-menu-button"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Main navigation - No Wishlist here */}
      <nav className={`store-nav-links ${mobileOpen ? "active" : ""}`}>

        <Link to="/" onClick={handleHomeClick}>
          Home
        </Link>

        <Link to="/products" onClick={closeMenus}>
          Products
        </Link>

        <Link to="/about" onClick={closeMenus}>
          About
        </Link>

        <Link to="/contact" onClick={closeMenus}>
          Contact
        </Link>

        <Link to="/customer-reviews" onClick={closeMenus}>
          Customer Reviews
        </Link>

      </nav>

      {/* Right side actions */}
      <div className="store-nav-actions">

        <Link
          to="/cart"
          className="store-cart-link"
          onClick={closeMenus}
        >
          <span>🛒</span> Cart
        </Link>

        {user ? (
          <div className="account-dropdown" ref={dropdownRef}>

            <button
              type="button"
              className="account-dropdown-trigger"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="navbar-avatar">
                {(user.name || "C").charAt(0).toUpperCase()}
              </span>

              <span className="navbar-user-name">
                {user.name || "My Account"}
              </span>

              <span>▾</span>
            </button>

            {menuOpen && (
              <div className="account-dropdown-menu">

                <div className="dropdown-user-info">
                  <strong>
                    Hello, {user.name || "Customer"}
                  </strong>
                  <span>{user.email}</span>
                </div>

                <Link to="/profile" onClick={closeMenus}>
                  My Profile
                </Link>

                {/* Wishlist appears only for customers */}
                {user.role === "CUSTOMER" && (
                  <Link to="/wishlist" onClick={closeMenus}>
                    ♡ My Wishlist
                  </Link>
                )}

                {user.role === "CUSTOMER" && (
  <Link to="/my-orders" onClick={closeMenus}>
    My Orders
  </Link>
)}

                {user.role === "ADMIN" && (
                  <Link to="/admin" onClick={closeMenus}>
                    Admin Dashboard
                  </Link>
                )}

                <button type="button" onClick={handleLogout}>
                  Logout
                </button>

              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="store-login-button"
            onClick={closeMenus}
          >
            Login
          </Link>
        )}

      </div>
    </header>
  );
}

export default Navbar;
