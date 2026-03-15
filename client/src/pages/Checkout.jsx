import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';

const Checkout = () => {
  const { items, itemsTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!items.length) {
    return <div className="max-w-3xl mx-auto p-4">Cart is empty.</div>;
  }

  const first = items[0];
  const deliveryFee = first.deliveryFee ?? 0;
  const totalAmount = itemsTotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        restaurantId: first.restaurantId,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          price: i.price,
        })),
        itemsTotal,
        deliveryFee,
        totalAmount,
        deliveryAddress: address,
      };
      const res = await api.post('/orders', orderPayload);
      clearCart();
      toast.success('Order placed');
      navigate(`/orders/track/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Checkout</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">Delivery address</h2>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
        <div className="text-sm">
          <p>Items total: ₹{itemsTotal}</p>
          <p>Delivery fee: ₹{deliveryFee}</p>
          <p className="font-semibold mt-1">Total payable: ₹{totalAmount}</p>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? 'Placing...' : 'Place order'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Razorpay integration: backend order creation and signature verification are implemented;
        this demo checkout directly creates an order. You can extend it to open the Razorpay widget
        before calling the orders API.
      </p>
    </div>
  );
};

export default Checkout;



