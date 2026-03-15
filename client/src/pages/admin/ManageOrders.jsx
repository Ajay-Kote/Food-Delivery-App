import { useEffect, useState } from 'react';
import { api } from '../../utils/api.js';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get('/admin/orders?page=1&limit=50');
      setOrders(res.data.data || []);
    };
    fetch();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Manage orders</h1>
      <div className="bg-white rounded-lg shadow divide-y text-sm">
        {orders.map((o) => (
          <div key={o._id} className="p-3 flex justify-between">
            <div>
              <p className="font-semibold">Order #{o._id.slice(-6)}</p>
              <p className="text-xs text-gray-500">
                Status: {o.status} • Total ₹{o.totalAmount}
              </p>
            </div>
            <p className="text-xs text-gray-500 self-center">
              {new Date(o.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        {!orders.length && <p className="p-3 text-xs text-gray-500">No orders found.</p>}
      </div>
    </div>
  );
};

export default ManageOrders;



