import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { api } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PendingApproval from './PendingApproval.jsx';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const IncomingOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await api.get('/restaurants/mine');
        const data = res.data.data;
        if (!data) {
          navigate('/owner/create-restaurant', { replace: true });
          return;
        }
        setRestaurantId(data._id);
        const ordersRes = await api.get(`/orders/restaurant/${data._id}?page=1&limit=50`);
        setOrders(ordersRes.data.data || []);
      } catch {
        navigate('/owner/create-restaurant', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  useEffect(() => {
    if (!restaurantId) return;
    const socket = io(SOCKET_URL);
    socket.emit('joinRoom', restaurantId);
    socket.on('order:placed', (order) => {
      setOrders((prev) => [order, ...prev]);
      toast.success('New order received');
    });
    return () => socket.disconnect();
  }, [restaurantId]);

  const updateStatus = async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o._id === id ? res.data.data : o)));
  };

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

  if (!restaurantId) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Incoming orders</h1>
      {orders.map((o) => (
        <div key={o._id} className="bg-white rounded-lg shadow p-3 mb-2 flex justify-between items-center flex-wrap gap-2">
          <div>
            <p className="text-sm font-semibold">Order #{o._id.slice(-6)}</p>
            <p className="text-xs text-gray-500">
              Status: {o.status} • Total ₹{o.totalAmount}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateStatus(o._id, 'Confirmed')}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Confirm
            </button>
            <button
              onClick={() => updateStatus(o._id, 'Preparing')}
              className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
              Preparing
            </button>
            <button
              onClick={() => updateStatus(o._id, 'ReadyForPickup')}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Ready
            </button>
          </div>
        </div>
      ))}
      {!orders.length && <p className="text-sm text-gray-500">No orders yet.</p>}
    </div>
  );
};

export default IncomingOrders;
