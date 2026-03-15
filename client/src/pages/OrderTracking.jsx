import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import MapView from '../components/MapView.jsx';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_STEPS = [
  'Placed',
  'Confirmed',
  'Preparing',
  'ReadyForPickup',
  'OutForDelivery',
  'Delivered',
];

const SHOW_MAP_STATUSES = ['ReadyForPickup', 'OutForDelivery'];

const OrderTracking = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return;
      const res = await api.get(`/orders/user/${user.id}?page=1&limit=50`);
      const found = (res.data.data || []).find((o) => o._id === orderId);
      if (found) setOrder(found);
    };
    fetchOrder();
  }, [orderId, user]);

  useEffect(() => {
    if (!order?.restaurantId) return;
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/restaurants/${order.restaurantId}`);
        setRestaurant(res.data.data || null);
      } catch {
        setRestaurant(null);
      }
    };
    fetchRestaurant();
  }, [order?.restaurantId]);

  useEffect(() => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomerLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationLoading(false);
      },
      () => {
        toast.error('Please allow location access to see the map');
        setLocationLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!user) return;
    const socket = io(SOCKET_URL);
    socket.emit('joinRoom', user.id);
    socket.on('order:statusUpdate', (updated) => {
      if (updated._id === orderId) setOrder(updated);
    });
    socket.on('agent:locationUpdate', (location) => {
      setAgentLocation(location);
    });
    return () => socket.disconnect();
  }, [orderId, user]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-4 flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-gray-500">Loading order...</div>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(order.status);
  const showMap = SHOW_MAP_STATUSES.includes(order.status);
  const restaurantLocation =
    restaurant?.location?.lat != null && restaurant?.location?.lng != null
      ? { lat: restaurant.location.lat, lng: restaurant.location.lng }
      : null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-2">Order tracking</h1>
      <p className="text-sm text-gray-600 mb-4">Order #{order._id.slice(-6)}</p>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <p className="text-sm font-semibold">
          Status: {order.status.replace(/([A-Z])/g, ' $1').trim()} 🛵
        </p>
        <p className="text-sm mt-1">Total: ₹{order.totalAmount}</p>
      </div>

      {/* Status stepper */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-sm font-semibold mb-3">Order progress</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {STATUS_STEPS.map((step, i) => {
            const isDone = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div
                key={step}
                className={`flex items-center gap-1.5 text-sm ${
                  isCurrent ? 'text-primary font-semibold' : isDone ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                <span className="inline-block w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px]">
                  {isDone ? '✓' : isCurrent ? '●' : '○'}
                </span>
                <span>{step.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map section */}
      {showMap ? (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-sm font-semibold mb-2">Live map</h2>
          {locationLoading ? (
            <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-sm text-gray-600">Getting your location...</p>
              </div>
            </div>
          ) : (
            <MapView
              customerLocation={customerLocation}
              restaurantLocation={restaurantLocation}
              agentLocation={agentLocation}
            />
          )}
          <p className="text-xs text-gray-500 mt-2">
            📍 You &nbsp; 🍔 Restaurant &nbsp; 🛵 Agent (live)
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600 text-sm">
          Map will appear when your order is out for delivery 🛵
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-sm font-semibold mb-2">Items</h2>
        {order.items.map((it) => (
          <p key={it.menuItemId} className="text-sm">
            {it.quantity} x ₹{it.price}
          </p>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
