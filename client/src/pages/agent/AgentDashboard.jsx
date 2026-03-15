import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { api } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const LOCATION_INTERVAL_MS = 5000;

const AgentDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [sharingOrderId, setSharingOrderId] = useState(null);
  const watchIdRef = useRef(null);
  const socketRef = useRef(null);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const res = await api.get(`/orders/agent/${user.id}?page=1&limit=50`);
      setOrders(res.data.data || []);
    };
    fetch();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket = io(SOCKET_URL);
    socket.emit('joinRoom', user.id);
    socket.on('agent:assigned', (order) => {
      setOrders((prev) => [order, ...prev]);
    });
    socketRef.current = socket;
    return () => socket.disconnect();
  }, [user]);

  const updateStatus = async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o._id === id ? res.data.data : o)));
  };

  const startSharingLocation = (order) => {
    if (sharingOrderId) {
      toast.error('Stop sharing for current order first');
      return;
    }
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported');
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastEmitRef.current < LOCATION_INTERVAL_MS) return;
        lastEmitRef.current = now;
        if (socketRef.current) {
          socketRef.current.emit('agent:shareLocation', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            orderId: order._id,
            customerId: order.customerId,
          });
        }
      },
      () => toast.error('Enable GPS to share location'),
      { enableHighAccuracy: true }
    );
    setSharingOrderId(order._id);
    toast.success('Sharing location with customer');
  };

  const stopSharingLocation = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharingOrderId(null);
    toast.success('Stopped sharing location');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Delivery agent dashboard</h1>
      {orders.map((o) => (
        <div
          key={o._id}
          className="bg-white rounded-lg shadow p-3 mb-2 flex flex-wrap justify-between items-center gap-2"
        >
          <div>
            <p className="text-sm font-semibold">Order #{o._id.slice(-6)}</p>
            <p className="text-xs text-gray-500">Status: {o.status}</p>
            {sharingOrderId === o._id && (
              <span className="inline-block mt-1 text-xs font-medium text-green-600">
                Sharing Location 🟢
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 self-center">
            {o.status === 'OutForDelivery' && (
              <>
                {sharingOrderId === o._id ? (
                  <button
                    type="button"
                    onClick={stopSharingLocation}
                    className="text-xs bg-gray-500 text-white px-2 py-1.5 rounded hover:bg-gray-600"
                  >
                    Stop Sharing
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startSharingLocation(o)}
                    className="text-xs bg-emerald-600 text-white px-2 py-1.5 rounded hover:bg-emerald-700"
                  >
                    Start Delivery
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => updateStatus(o._id, 'ReadyForPickup')}
              className="text-xs bg-yellow-500 text-white px-2 py-1.5 rounded hover:bg-yellow-600"
            >
              Ready for pickup
            </button>
            <button
              type="button"
              onClick={() => updateStatus(o._id, 'OutForDelivery')}
              className="text-xs bg-blue-600 text-white px-2 py-1.5 rounded hover:bg-blue-700"
            >
              Out for delivery
            </button>
            <button
              type="button"
              onClick={() => updateStatus(o._id, 'Delivered')}
              className="text-xs bg-green-600 text-white px-2 py-1.5 rounded hover:bg-green-700"
            >
              Delivered
            </button>
          </div>
        </div>
      ))}
      {!orders.length && <p className="text-sm text-gray-500">No assigned deliveries.</p>}
    </div>
  );
};

export default AgentDashboard;
