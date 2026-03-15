import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import RestaurantList from './pages/RestaurantList.jsx';
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import Profile from './pages/Profile.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import CreateRestaurant from './pages/owner/CreateRestaurant.jsx';
import EditRestaurant from './pages/owner/EditRestaurant.jsx';
import ManageMenu from './pages/owner/ManageMenu.jsx';
import IncomingOrders from './pages/owner/IncomingOrders.jsx';
import AgentDashboard from './pages/agent/AgentDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes - no navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* All other routes - with navbar */}
            <Route element={<Layout />}>
              <Route path="/unauthorized" element={<Unauthorized />} />
              {/* Customer + public */}
              <Route path="/" element={<Home />} />
              <Route path="/restaurants" element={<RestaurantList />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />

              {/* Customer only */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute roles={['customer']}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute roles={['customer']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute roles={['customer']}>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/track/:orderId"
                element={
                  <ProtectedRoute roles={['customer']}>
                    <OrderTracking />
                  </ProtectedRoute>
                }
              />

              {/* Any authenticated user */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Owner only */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute roles={['owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/menu"
                element={
                  <ProtectedRoute roles={['owner']}>
                    <ManageMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/orders"
                element={
                  <ProtectedRoute roles={['owner']}>
                    <IncomingOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/create-restaurant"
                element={
                  <ProtectedRoute roles={['owner']}>
                    <CreateRestaurant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/restaurant"
                element={
                  <ProtectedRoute roles={['owner']}>
                    <EditRestaurant />
                  </ProtectedRoute>
                }
              />

              {/* Agent only */}
              <Route
                path="/agent/dashboard"
                element={
                  <ProtectedRoute roles={['agent']}>
                    <AgentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin only */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <ManageOrders />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch old paths - redirect to new dashboard paths */}
            <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
            <Route path="/agent" element={<Navigate to="/agent/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/orders/history" element={<Navigate to="/orders" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
