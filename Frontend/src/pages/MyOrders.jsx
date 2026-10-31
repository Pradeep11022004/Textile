
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MyOrders.css";
import { api } from "../services/api";

const statusSteps = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

// Reusable My Orders content
export function MyOrdersContent() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load logged-in customer's orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setError("Please login to view your orders.");
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user?.id || user.role !== "CUSTOMER") {
          setError("Customer account required to view orders.");
          return;
        }

        const data = await api.get(
          `/api/orders?userId=${user.id}`
        );

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Filter orders by status
  const filteredOrders =
    selectedStatus === "ALL"
      ? orders
      : orders.filter(
          (order) => order.status === selectedStatus
        );

  // Status CSS class
  const getStatusClass = (status) => {
    return `order-status status-${(status || "pending").toLowerCase()}`;
  };

  // Load order items when customer clicks View Details
  const toggleOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    try {
      setError("");

      const items = await api.get(
        `/api/orders/${orderId}/items`
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                items: Array.isArray(items) ? items : [],
              }
            : order
        )
      );

      setExpandedOrder(orderId);
    } catch (err) {
      setError(err.message || "Unable to load order details.");
    }
  };

  return (
    <section className="my-orders-page">

      <header className="my-orders-heading">
        <p>YOUR SHOPPING HISTORY</p>
        <h1>My Orders</h1>
        <span>Track your purchases and order status.</span>
      </header>

      {/* Loading */}
      {loading && (
        <section className="no-orders">
          <p>Loading your orders...</p>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="no-orders">
          <h2>Unable to load orders</h2>
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && (
        <>
          {/* Filter */}
          <section className="orders-toolbar">
            <label htmlFor="order-status-filter">
              Filter orders
            </label>

            <select
              id="order-status-filter"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </section>

          {/* No orders */}
          {filteredOrders.length === 0 ? (
            <section className="no-orders">
              <h2>No orders found</h2>
              <p>
                There are no orders with this status.
              </p>

              <Link to="/products">
                Explore Products
              </Link>
            </section>
          ) : (
            <section className="orders-list">

              {filteredOrders.map((order) => {
                const currentStep = statusSteps.indexOf(
                  order.status
                );

                const items = order.items || [];

                return (
                  <article
                    className="order-card"
                    key={order.id}
                  >

                    {/* Order Header */}
                    <div className="order-card-header">

                      <div>
                        <span className="order-label">
                          ORDER ID
                        </span>

                        <h2>#{order.id}</h2>
                      </div>

                      <span className={getStatusClass(order.status)}>
                        {order.status}
                      </span>

                    </div>

                    {/* Order Information */}
                    <div className="order-meta">

                      <p>
                        <span>Order date</span>

                        <strong>
                          {order.orderDate
                            ? new Date(
                                order.orderDate
                              ).toLocaleDateString("en-IN")
                            : "N/A"}
                        </strong>
                      </p>

                      <p>
                        <span>Total amount</span>

                        <strong>
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </p>

                      <p>
                        <span>Products</span>

                        <strong>
                          {order.items
                            ? order.items.length
                            : "View details"}
                        </strong>
                      </p>

                    </div>

                    {/* Order Progress */}
                    {order.status !== "CANCELLED" && (
                      <div className="order-progress">

                        {statusSteps.map((step, index) => {
                          const completed =
                            currentStep >= 0 &&
                            index <= currentStep;

                          return (
                            <div
                              className={`progress-step ${
                                completed ? "completed" : ""
                              }`}
                              key={step}
                            >
                              <span className="progress-dot" />

                              <span className="progress-label">
                                {step}
                              </span>
                            </div>
                          );
                        })}

                      </div>
                    )}

                    {/* Cancelled Message */}
                    {order.status === "CANCELLED" && (
                      <p className="cancelled-notice">
                        This order has been cancelled.
                      </p>
                    )}

                    {/* View Details */}
                    <button
                      type="button"
                      className="order-details-toggle"
                      onClick={() =>
                        toggleOrderDetails(order.id)
                      }
                      aria-expanded={
                        expandedOrder === order.id
                      }
                    >
                      {expandedOrder === order.id
                        ? "Hide order details −"
                        : "View order details +"}
                    </button>

                    {/* Order Items */}
                    {expandedOrder === order.id && (
                      <div className="order-items-details">

                        {items.length === 0 ? (
                          <p>No items found for this order.</p>
                        ) : (
                          items.map((item) => (
                            <div
                              className="order-product-row"
                              key={item.id}
                            >

                              <span>
                                {item.product?.name || "Product"} ×{" "}
                                {item.quantityMetres} metres
                              </span>

                              <strong>
                                ₹
                                {Number(
                                  item.subtotal || 0
                                ).toLocaleString("en-IN")}
                              </strong>

                            </div>
                          ))
                        )}

                      </div>
                    )}

                  </article>
                );
              })}

            </section>
          )}
        </>
      )}

      <div className="orders-back-link">
        <Link to="/products">
          ← Continue Shopping
        </Link>
      </div>

    </section>
  );
}

// Standalone My Orders page
function MyOrders() {
  return (
    <main>
      <MyOrdersContent />
    </main>
  );
}

export default MyOrders;
