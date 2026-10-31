
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer" id="contact">

      <div className="footer-container">

        <div className="footer-brand">
  <Link to="/" className="footer-brand-link">
    <h2>
      Aura Textile<span>.</span>
    </h2>
  </Link>

  <p>
    Discover quality fabrics and timeless styles
    for every occasion.
  </p>
</div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/#about">About Us</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/cart">My Cart</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>
            Email: support@auratextile.com
          </p>

          <p>
            Phone: +91 98765 43210
          </p>

          <p>
            Chennai, Tamil Nadu, India
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Aura Textile. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;
