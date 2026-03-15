import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const getHomePath = (role) => {
  switch (role) {
    case 'customer': return '/';
    case 'owner': return '/owner/dashboard';
    case 'agent': return '/agent/dashboard';
    case 'admin': return '/admin/dashboard';
    default: return '/';
  }
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass = 'text-sm font-medium text-gray-700 hover:text-primary';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={user ? getHomePath(user.role) : '/'} className="text-xl font-bold text-primary hover:opacity-90">
          Food Delivery
        </Link>
        <nav className="flex items-center gap-5">
          {!user ? (
            <>
              <Link to="/restaurants" className={linkClass}>Restaurants</Link>
              <Link to="/login" className={linkClass}>Login</Link>
              <Link to="/signup" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 shadow-sm">
                Sign up
              </Link>
            </>
          ) : user.role === 'customer' ? (
            <>
              <Link to="/" className={linkClass}>Home</Link>
              <Link to="/restaurants" className={linkClass}>Restaurants</Link>
              <Link to="/cart" className={linkClass}>Cart</Link>
              <Link to="/orders" className={linkClass}>Orders</Link>
              <Link to="/profile" className={linkClass}>Profile</Link>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Logout
              </button>
            </>
          ) : user.role === 'owner' ? (
            <>
              <Link to="/owner/dashboard" className={linkClass}>Dashboard</Link>
              <Link to="/owner/restaurant" className={linkClass}>My Restaurant</Link>
              <Link to="/owner/menu" className={linkClass}>Manage Menu</Link>
              <Link to="/owner/orders" className={linkClass}>Incoming Orders</Link>
              <Link to="/profile" className={linkClass}>Profile</Link>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Logout
              </button>
            </>
          ) : user.role === 'agent' ? (
            <>
              <Link to="/agent/dashboard" className={linkClass}>My Deliveries</Link>
              <Link to="/profile" className={linkClass}>Profile</Link>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Logout
              </button>
            </>
          ) : user.role === 'admin' ? (
            <>
              <Link to="/admin/dashboard" className={linkClass}>Dashboard</Link>
              <Link to="/admin/users" className={linkClass}>Manage Users</Link>
              <Link to="/admin/orders" className={linkClass}>Manage Orders</Link>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/profile" className={linkClass}>Profile</Link>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
