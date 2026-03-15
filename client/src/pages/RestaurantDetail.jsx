import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';

const isRestaurantOpen = (openingHours) => {
  if (!openingHours) return true;
  const now = new Date();
  const [openH, openM] = (openingHours.open || '09:00').split(':').map(Number);
  const [closeH, closeM] = (openingHours.close || '23:00').split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rRes, mRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/menu/${id}`),
        ]);
        setRestaurant(rRes.data.data);
        setMenu(mRes.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const open = useMemo(() => (restaurant ? isRestaurantOpen(restaurant.openingHours) : true), [
    restaurant,
  ]);

  if (loading) {
    return <div className="p-4 max-w-4xl mx-auto animate-pulse h-40 bg-gray-200 rounded" />;
  }

  if (!restaurant) return <div className="p-4 max-w-4xl mx-auto">Restaurant not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
          <p className="text-xs text-gray-500">{restaurant.cuisine?.join(', ')}</p>
          <p className="text-xs text-gray-500 mt-1">
            ⭐ {restaurant.rating?.toFixed(1) || 'New'} • Fee ₹{restaurant.deliveryFee ?? 0} •{' '}
            {restaurant.estimatedDeliveryTime} mins
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {open ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {menu.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-3 flex">
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-1">{item.description}</p>
              <p className="text-xs text-gray-500">
                {item.isVeg ? 'Veg' : 'Non-veg'} • ⭐ {item.avgRating?.toFixed(1) || 'New'}
              </p>
              <p className="text-sm font-bold mt-2">₹{item.price}</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <button
                disabled={!open}
                onClick={() =>
                  addItem({
                    menuItemId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    restaurantId: restaurant._id,
                    restaurantName: restaurant.name,
                    deliveryFee: restaurant.deliveryFee ?? 0,
                  })
                }
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  open
                    ? 'bg-primary text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;



