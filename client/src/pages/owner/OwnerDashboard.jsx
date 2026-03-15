import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PendingApproval from './PendingApproval.jsx';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState({ totalOrders: 0, totalEarnings: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchMine = async () => {
      try {
        const res = await api.get('/restaurants/mine');
        const data = res.data.data;
        if (!data) {
          navigate('/owner/create-restaurant', { replace: true });
          return;
        }
        setRestaurant(data);
        const ordersRes = await api.get(`/orders/restaurant/${data._id}?page=1&limit=100`);
        const orders = ordersRes.data.data || [];
        setStats({
          totalOrders: orders.length,
          totalEarnings: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        });
      } catch {
        navigate('/owner/create-restaurant', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchMine();
  }, [user, navigate]);

  if (user?.role === 'owner' && user?.isApproved === false) {
    return <PendingApproval />;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Restaurant owner dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Total orders</p>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Earnings</p>
          <p className="text-2xl font-bold">₹{stats.totalEarnings}</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
