
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";

import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/WishList";

// ========================================
// GET LOGGED-IN USER
// ========================================

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read user information:", error);
    return null;
  }
}

// ========================================
// SCROLL TO TOP ON PAGE NAVIGATION
// ========================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // These routes point to sections inside Home.
    if (
      pathname === "/about" ||
      pathname === "/contact" ||
      pathname === "/customer-reviews"
    ) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

// ========================================
// PROTECTED CUSTOMER ROUTES
// ========================================

function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  // User must be logged in.
  if (!user?.id) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const role = String(user.role || "").toUpperCase();

  // Admin cannot access customer purchasing pages.
  const adminBlockedRoutes = [
    "/cart",
    "/checkout",
    "/order-success",
    "/my-orders",
  ];

  if (
    role === "ADMIN" &&
    adminBlockedRoutes.includes(location.pathname)
  ) {
    return <Navigate to="/products" replace />;
  }

  return children;
}

// ========================================
// ADMIN ROUTE PROTECTION
// ========================================

function AdminRoute({ children }) {
  const user = getStoredUser();

  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role || "").toUpperCase();

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ========================================
// 404 PAGE
// ========================================

function NotFound() {
  return (
    <main className="not-found-page">
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link to="/" className="not-found-link">
        Return to Home
      </Link>
    </main>
  );
}

// ========================================
// MAIN APP
// ========================================

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Navbar />

      <Routes>
        {/* =================================
            PUBLIC ROUTES
        ================================= */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<Home />} />

        <Route path="/contact" element={<Home />} />

        <Route
          path="/customer-reviews"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<ProductList />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================
            CUSTOMER ROUTES
        ================================= */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        {/* =================================
            WISHLIST
        ================================= */}

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* =================================
            ADMIN ROUTE
        ================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* =================================
            404 ROUTE
        ================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
