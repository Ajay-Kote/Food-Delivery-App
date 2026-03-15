import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PendingApproval from './PendingApproval.jsx';

const CUISINE_OPTIONS = [
  'Indian',
  'Chinese',
  'Italian',
  'Fast Food',
  'Pizza',
  'Biryani',
  'South Indian',
  'Desserts',
];

const CreateRestaurant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    cuisine: [],
    address: '',
    openingTime: '09:00',
    closingTime: '23:00',
    deliveryFee: 40,
    estimatedDeliveryTime: 30,
    image: '',
  });

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get('/restaurants/mine');
        if (res.data.data) navigate('/owner/dashboard', { replace: true });
      } catch {
        // no restaurant, show form
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [navigate]);

  const toggleCuisine = (cuisine) => {
    setForm((prev) => ({
      ...prev,
      cuisine: prev.cuisine.includes(cuisine)
        ? prev.cuisine.filter((c) => c !== cuisine)
        : [...prev.cuisine, cuisine],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/restaurants', {
        name: form.name.trim(),
        description: form.description.trim(),
        cuisine: form.cuisine.length ? form.cuisine : ['Indian'],
        address: form.address.trim(),
        openingHours: {
          open: form.openingTime,
          close: form.closingTime,
        },
        deliveryFee: Number(form.deliveryFee) || 0,
        estimatedDeliveryTime: Number(form.estimatedDeliveryTime) || 30,
        ...(form.image.trim() && { image: form.image.trim() }),
      });
      toast.success('Restaurant created successfully! 🎉');
      navigate('/owner/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role === 'owner' && user?.isApproved === false) {
    return <PendingApproval />;
  }

  if (checking) {
    return (
      <div className="max-w-xl mx-auto p-4 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Create your restaurant</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant name *</label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Spice Garden"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description of your restaurant"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCuisine(c)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  form.cuisine.includes(c)
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 text-gray-700 hover:border-primary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Full address"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening time</label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              value={form.openingTime}
              onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Closing time</label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              value={form.closingTime}
              onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery fee (₹)</label>
            <input
              type="number"
              min={0}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              value={form.deliveryFee}
              onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Est. delivery (mins)</label>
            <input
              type="number"
              min={1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              value={form.estimatedDeliveryTime}
              onChange={(e) => setForm({ ...form, estimatedDeliveryTime: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://... or Cloudinary URL"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create restaurant'}
        </button>
      </form>
    </div>
  );
};

export default CreateRestaurant;
