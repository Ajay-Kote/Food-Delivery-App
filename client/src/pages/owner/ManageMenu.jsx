import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PendingApproval from './PendingApproval.jsx';

const ManageMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState('');
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category: 'dinner', isVeg: true });
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'dinner',
    isVeg: true,
    image: '',
    isAvailable: true,
  });

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
        const menuRes = await api.get(`/menu/owner/${data._id}`);
        setItems(menuRes.data.data || []);
      } catch {
        navigate('/owner/create-restaurant', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!restaurantId) return;
    try {
      const payload = {
        restaurantId,
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        category: form.category,
        isVeg: form.isVeg,
        isAvailable: form.isAvailable,
        ...(form.image.trim() && { image: form.image.trim() }),
      };
      const res = await api.post('/menu', payload);
      setItems((prev) => [...prev, res.data.data]);
      setForm({ ...form, name: '', description: '', price: '', image: '' });
      toast.success('Item added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      category: item.category,
      isVeg: item.isVeg,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const item = items.find((i) => i._id === editingId);
      const res = await api.put(`/menu/${editingId}`, {
        ...item,
        name: editForm.name.trim(),
        description: editForm.description.trim() || undefined,
        price: Number(editForm.price),
        category: editForm.category,
        isVeg: editForm.isVeg,
      });
      setItems((prev) => prev.map((i) => (i._id === editingId ? res.data.data : i)));
      setEditingId(null);
      toast.success('Item updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      const res = await api.put(`/menu/${item._id}`, { ...item, isAvailable: !item.isAvailable });
      setItems((prev) => prev.map((i) => (i._id === item._id ? res.data.data : i)));
      toast.success(res.data.data.isAvailable ? 'Item available' : 'Item unavailable');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/menu/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('Item deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
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
      <h1 className="text-xl font-semibold mb-4">Manage menu</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-4 mb-6 space-y-3">
        <h2 className="text-sm font-semibold">Add menu item</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Name *"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Price *"
            type="number"
            min={0}
            step={0.01}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <input
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snacks">Snacks</option>
            <option value="dinner">Dinner</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVeg"
              checked={form.isVeg}
              onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isVeg" className="text-sm">Veg</label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isAvailable"
            checked={form.isAvailable}
            onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isAvailable" className="text-sm">Available</label>
        </div>
        <input
          placeholder="Image URL (optional)"
          type="url"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <button
          type="submit"
          className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Add item
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Menu items</h2>
        {items.map((it) => (
          <div
            key={it._id}
            className="bg-white rounded-lg shadow border border-gray-100 p-3 flex flex-wrap justify-between items-start gap-2"
          >
            {editingId === it._id ? (
              <form onSubmit={handleUpdate} className="w-full space-y-2">
                <input
                  placeholder="Name"
                  required
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <input
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Price"
                    required
                    min={0}
                    step={0.01}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  />
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snacks">Snacks</option>
                    <option value="dinner">Dinner</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={editForm.isVeg}
                      onChange={(e) => setEditForm({ ...editForm, isVeg: e.target.checked })}
                    />
                    Veg
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="text-xs bg-primary text-white px-2 py-1 rounded">
                    Save
                  </button>
                  <button type="button" onClick={cancelEdit} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <p className="font-medium text-gray-900">
                    {it.name} &nbsp; ₹{it.price} &nbsp; {it.isVeg ? '🟢 Veg' : '🔴 Non-veg'}
                  </p>
                  <p className="text-xs text-gray-500">Category: {it.category}</p>
                  {it.description && <p className="text-xs text-gray-600 mt-0.5">{it.description}</p>}
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                      it.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {it.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(it)}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1.5 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(it)}
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1.5 rounded hover:bg-gray-300"
                  >
                    Toggle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(it._id)}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1.5 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {!items.length && <p className="text-sm text-gray-500">No items yet. Add one above.</p>}
      </div>
    </div>
  );
};

export default ManageMenu;
