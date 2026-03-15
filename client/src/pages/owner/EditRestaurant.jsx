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

const EditRestaurant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
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
    isActive: true,
  });

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const res = await api.get('/restaurants/mine');
        const data = res.data.data;
        if (!data) {
          navigate('/owner/create-restaurant', { replace: true });
          return;
        }
        setRestaurant(data);
        const oh = data.openingHours || {};
        setForm({
          name: data.name || '',
          description: data.description || '',
          cuisine: Array.isArray(data.cuisine) ? data.cuisine : [],
          address: data.address || '',
          openingTime: oh.open || '09:00',
          closingTime: oh.close || '23:00',
          deliveryFee: data.deliveryFee ?? 40,
          estimatedDeliveryTime: data.estimatedDeliveryTime ?? 30,
          image: data.image || '',
          isActive: data.isActive !== false,
        });
      } catch {
        navigate('/owner/create-restaurant', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchMine();
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
    if (!restaurant) return;
    setSaving(true);
    try {
      await api.put(`/restaurants/${restaurant._id}`, {
        name: form.name.trim(),
        description: form.description.trim(),
        cuisine: form.cuisine.length ? form.cuisine : ['Indian'],
        address: form.address.trim(),
        openingHours: { open: form.openingTime, close: form.closingTime },
        deliveryFee: Number(form.deliveryFee) || 0,
        estimatedDeliveryTime: Number(form.estimatedDeliveryTime) || 30,
        ...(form.image.trim() && { image: form.image.trim() }),
        isActive: form.isActive,
      });
      toast.success('Restaurant updated');
      setRestaurant((prev) => (prev ? { ...prev, ...form } : null));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (user?.role === 'owner' && user?.isApproved === false) {
    return <PendingApproval />;
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-4 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">My restaurant</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant name *</label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
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
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Restaurant open (visible to customers)
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default EditRestaurant;
