
import { Link, useLocation } from "react-router-dom";
import "../styles/OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <main className="order-success-page">
        <div className="success-card">
          <h2>Order information unavailable</h2>
          <p>Please check your order history.</p>
          <Link to="/my-orders">View My Orders</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="order-success-page">
      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <p className="success-label">ORDER CONFIRMED</p>

        <h1>Order Placed Successfully!</h1>

        <p className="success-description">
          Thank you for shopping with us.
          Your order has been received successfully.
        </p>

        <div className="success-order-details">
          <div>
            <span>Order ID</span>
            <strong>#{order.id}</strong>
          </div>

          <div>
            <span>Order Status</span>
            <strong>{order.status}</strong>
          </div>

          <div>
            <span>Total Amount</span>
            <strong>
              ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Payment Method</span>
            <strong>{order.paymentMethod}</strong>
          </div>
        </div>

        <p className="success-delivery-message">
          We will process your order soon.
        </p>

        <div className="success-actions">
          <Link to="/my-orders" className="success-primary-button">
            View My Orders
          </Link>

          <Link to="/products" className="success-secondary-button">
            Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
}

export default OrderSuccess;
