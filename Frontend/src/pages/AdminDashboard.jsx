
import { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/AdminDashboard.css";

const emptyProduct = {
  name: "",
  material: "",
  color: "",
  pricePerMetre: "",
  stockMetres: "",
  imageUrl: "",
  description: "",
  categoryId: "",
};

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load products and categories
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [productData, categoryData] = await Promise.all([
        api.get("/api/products"),
        api.get("/api/categories"),
      ]);

      setProducts(Array.isArray(productData) ? productData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      setError(err.message || "Unable to load products and categories.");
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    try {
      const data = await api.get("/api/admin/dashboard/stats");

      setDashboardStats({
        totalOrders: data.totalOrders ?? 0,
        pendingOrders: data.pendingOrders ?? 0,
        deliveredOrders: data.deliveredOrders ?? 0,
        totalRevenue: data.totalRevenue ?? 0,
        totalCustomers: data.totalCustomers ?? 0,
      });
    } catch (err) {
      setError(err.message || "Unable to load dashboard statistics.");
    }
  };

  // Load customer orders
  const loadOrders = async () => {
    try {
      const data = await api.get("/api/orders/admin");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load customer orders.");
    }
  };

  // Initial data loading
  useEffect(() => {
    loadData();
    loadDashboardStats();
  }, []);

  // Handle product form changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Reset product form
  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
  };

  // Add or update product
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const product = {
      name: form.name.trim(),
      material: form.material.trim(),
      color: form.color.trim(),
      pricePerMetre: Number(form.pricePerMetre),
      stockMetres: Number(form.stockMetres),
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim(),
      category: {
        id: Number(form.categoryId),
      },
    };

    if (
      !product.name ||
      !product.material ||
      !form.categoryId ||
      !Number.isFinite(product.pricePerMetre) ||
      product.pricePerMetre <= 0 ||
      !Number.isFinite(product.stockMetres) ||
      product.stockMetres < 0
    ) {
      setError("Enter valid product details, price, stock and category.");
      return;
    }

    try {
      if (editingId !== null) {
        await api.put(`/api/products/${editingId}`, product);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/api/products", product);
        setMessage("Product added successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save product.");
    }
  };

  // Load product details into the form for editing
  const startEdit = (product) => {
    setForm({
      name: product.name || "",
      material: product.material || "",
      color: product.color || "",
      pricePerMetre: String(product.pricePerMetre ?? ""),
      stockMetres: String(product.stockMetres ?? ""),
      imageUrl: product.imageUrl || "",
      description: product.description || "",
      categoryId: String(
        product.category?.id ?? product.categoryId ?? ""
      ),
    });

    setEditingId(product.id);
    setActiveTab("form");
    setMessage("");
    setError("");
  };

  // Delete product
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await api.delete(`/api/products/${product.id}`);

      setMessage("Product deleted successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete product.");
    }
  };

  // Stock calculations
  const lowStockCount = products.filter(
    (product) =>
      Number(product.stockMetres) > 0 &&
      Number(product.stockMetres) < 10
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stockMetres) === 0
  ).length;

  return (
    <main className="admin-page">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <span className="admin-brand-icon">T</span>
          <span>
            Textile<span>Store</span>
          </span>
        </div>

        <p className="admin-menu-label">MANAGEMENT</p>

        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => {
            setActiveTab("overview");
            loadDashboardStats();
          }}
        >
          Overview
        </button>

        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products & Stock
        </button>

        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={async () => {
            setActiveTab("orders");
            setError("");
            await loadOrders();
          }}
        >
          Customer Orders
        </button>

        <button
          className={activeTab === "form" ? "active" : ""}
          onClick={() => {
            resetForm();
            setActiveTab("form");
            setMessage("");
            setError("");
          }}
        >
          Add Product
        </button>

      </aside>

      {/* Main content */}
      <section className="admin-main">

        <header className="admin-header">
          <div>
            <p>TEXTILE STORE / ADMIN</p>

            <h1>
              {activeTab === "overview"
                ? "Dashboard Overview"
                : activeTab === "products"
                  ? "Products & Stock"
                  : activeTab === "form"
                    ? editingId !== null
                      ? "Edit Product"
                      : "Add Product"
                    : "Customer Orders"}
            </h1>
          </div>

          <span className="admin-role">Administrator</span>
        </header>

        {message && (
          <p className="admin-message">{message}</p>
        )}

        {error && (
          <p className="admin-message">{error}</p>
        )}

        {loading && (
          <p>Loading products...</p>
        )}

        {/* Dashboard Overview */}
        {activeTab === "overview" && (
          <>
            <section className="admin-stats">

              <article className="admin-stat-card">
                <span>Total Products</span>
                <strong>{products.length}</strong>
                <small>Products in inventory</small>
              </article>

              <article className="admin-stat-card">
                <span>Total Orders</span>
                <strong>{dashboardStats.totalOrders}</strong>
                <small>All customer orders</small>
              </article>

              <article className="admin-stat-card">
                <span>Total Revenue</span>
                <strong>
                  ₹{Number(dashboardStats.totalRevenue).toLocaleString("en-IN")}
                </strong>
                <small>Excluding cancelled orders</small>
              </article>

              <article className="admin-stat-card">
                <span>Total Customers</span>
                <strong>{dashboardStats.totalCustomers}</strong>
                <small>Registered customers</small>
              </article>

              <article className="admin-stat-card">
                <span>Pending Orders</span>
                <strong>{dashboardStats.pendingOrders}</strong>
                <small>Waiting for processing</small>
              </article>

              <article className="admin-stat-card">
                <span>Delivered Orders</span>
                <strong>{dashboardStats.deliveredOrders}</strong>
                <small>Successfully delivered</small>
              </article>

              <article className="admin-stat-card">
                <span>Low Stock</span>
                <strong>{lowStockCount}</strong>
                <small>Below 10 metres</small>
              </article>

              <article className="admin-stat-card">
                <span>Out of Stock</span>
                <strong>{outOfStockCount}</strong>
                <small>Unavailable products</small>
              </article>

            </section>

            <section className="admin-panel">
              <h2>Inventory Summary</h2>

              <p>Total Categories: {categories.length}</p>

              <button
                className="admin-primary-button"
                onClick={() => setActiveTab("products")}
              >
                Manage Products
              </button>
            </section>
          </>
        )}

        {/* Product Inventory */}
        {activeTab === "products" && (
          <section className="admin-panel">

            <div className="admin-header">
              <h2>Product Inventory</h2>

              <button
                className="admin-primary-button"
                onClick={() => {
                  resetForm();
                  setActiveTab("form");
                }}
              >
                + Add Product
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Product</th>
                    <th>Material</th>
                    <th>Price / metre</th>
                    <th>Stock / metres</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const stock = Number(product.stockMetres);

                    return (
                      <tr key={product.id}>

                        <td>
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              width="55"
                              height="55"
                              style={{
                                objectFit: "cover",
                                borderRadius: 6,
                              }}
                            />
                          ) : (
                            "No photo"
                          )}
                        </td>

                        <td>{product.name}</td>
                        <td>{product.material}</td>

                        <td>
                          ₹{Number(product.pricePerMetre).toLocaleString("en-IN")}
                        </td>

                        <td>{stock}</td>

                        <td>
                          <span
                            className={`admin-stock ${
                              stock === 0
                                ? "stock-empty"
                                : stock < 10
                                  ? "stock-low"
                                  : "stock-available"
                            }`}
                          >
                            {stock === 0
                              ? "Out of stock"
                              : stock < 10
                                ? "Low stock"
                                : "Available"}
                          </span>
                        </td>

                        <td>
                          <button onClick={() => startEdit(product)}>
                            Edit
                          </button>

                          <button onClick={() => handleDelete(product)}>
                            Delete
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

              {!loading && products.length === 0 && (
                <p>No products found in the database.</p>
              )}
            </div>

          </section>
        )}

        {/* Customer Orders */}
        {activeTab === "orders" && (
          <section className="admin-panel">

            <h2>Customer Orders</h2>

            <div className="admin-table-wrapper">
              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>

                      <td>#{order.id}</td>

                      <td>{order.user?.name || "Unknown"}</td>

                      <td>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleString()
                          : "N/A"}
                      </td>

                      <td>
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </td>

                      <td>{order.paymentMethod || "N/A"}</td>

                      <td>
                        <span className="admin-stock">
                          {order.status || "PENDING"}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

              {orders.length === 0 && (
                <p>No customer orders found.</p>
              )}
            </div>

          </section>
        )}

        {/* Add / Edit Product Form */}
        {activeTab === "form" && (
          <section className="admin-panel">

            <h2>
              {editingId !== null ? "Update Product" : "New Product"}
            </h2>

            <form
              className="admin-product-form"
              onSubmit={handleSubmit}
            >

              <label>
                Product Name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Material Name *
                <input
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  placeholder="e.g. Pure Cotton"
                  required
                />
              </label>

              <label>
                Color
                <input
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                />
              </label>

              <label>
                Category *
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Price per metre (₹) *
                <input
                  type="number"
                  name="pricePerMetre"
                  value={form.pricePerMetre}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </label>

              <label>
                Stock (metres) *
                <input
                  type="number"
                  name="stockMetres"
                  value={form.stockMetres}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </label>

              <label className="admin-form-full">
                Image URL
                <input
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/fabric.jpg"
                />
              </label>

              {form.imageUrl && (
                <div className="admin-form-full">
                  <p>Image preview</p>

                  <img
                    src={form.imageUrl}
                    alt="Product preview"
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}

              <label className="admin-form-full">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                />
              </label>

              <div className="admin-form-full admin-form-actions">

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                >
                  Clear Form
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                >
                  Cancel
                </button>

              </div>

            </form>
          </section>
        )}

      </section>
    </main>
  );
}

export default AdminDashboard;
