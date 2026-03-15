import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const PendingApproval = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">⏳</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Account pending approval</h1>
        <p className="text-gray-600 text-sm mb-4">
          Your restaurant owner account is waiting for admin approval.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          You will get access to your dashboard once approved.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
