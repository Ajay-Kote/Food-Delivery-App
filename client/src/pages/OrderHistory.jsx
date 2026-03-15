import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const res = await api.get(`/orders/user/${user.id}?page=1&limit=20`);
      setOrders(res.data.data || []);
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Order history</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded-lg shadow p-3 flex justify-between">
            <div>
              <p className="text-sm font-semibold">Order #{o._id.slice(-6)}</p>
              <p className="text-xs text-gray-500">
                Status: {o.status} • Total ₹{o.totalAmount}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(o.createdAt).toLocaleString()}
              </p>
            </div>
            <Link
              to={`/orders/track/${o._id}`}
              className="text-xs text-primary self-center hover:underline"
            >
              Track
            </Link>
          </div>
        ))}
        {!orders.length && <p className="text-sm text-gray-500">No orders yet.</p>}
      </div>
    </div>
  );
};

export default OrderHistory;



