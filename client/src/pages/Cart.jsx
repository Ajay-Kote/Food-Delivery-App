import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const { items, itemsTotal, removeItem } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <h1 className="text-xl font-semibold mb-2">Your cart is empty</h1>
        <Link to="/restaurants" className="text-primary text-sm hover:underline">
          Browse restaurants
        </Link>
      </div>
    );
  }

  const restaurant = items[0];
  const deliveryFee = restaurant.deliveryFee ?? 0;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Cart</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        {items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between items-center border-b py-2">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">
                Qty {item.quantity} • ₹{item.price}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
              <button
                onClick={() => removeItem(item.menuItemId)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
        <div className="text-sm">
          <p>Items total: ₹{itemsTotal}</p>
          <p>Delivery fee: ₹{deliveryFee}</p>
          <p className="font-semibold mt-1">Total: ₹{itemsTotal + deliveryFee}</p>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-orange-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;



