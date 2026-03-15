import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';

const Home = () => {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const [restLoading, setRestLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!user) {
          setRecLoading(false);
          return;
        }
        const res = await api.get(`/recommendations/${user.id}`);
        setRecommended(res.data.data || []);
      } catch {
        // ignore
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecommendations();
  }, [user]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/restaurants?page=1&limit=8');
        setRestaurants(res.data.data || []);
      } catch {
        setRestaurants([]);
      } finally {
        setRestLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-6 text-left">
        {/* Recommended (when logged in) */}
        {user && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommended for you</h2>
            {recLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-xl" />
                ))}
              </div>
            )}
            {!recLoading && recommended.length === 0 && (
              <p className="text-sm text-gray-500">Order something to get personalized recommendations.</p>
            )}
            {!recLoading && recommended.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recommended.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow border border-gray-100 p-3">
                    <div className="h-20 bg-gray-100 rounded-lg mb-2" />
                    <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                    <p className="text-sm font-bold text-primary mt-1">₹{item.price}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Restaurants */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Restaurants</h2>
          {restLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse h-44 bg-gray-200 rounded-xl" />
              ))}
            </div>
          )}
          {!restLoading && restaurants.length === 0 && (
            <p className="text-sm text-gray-500 py-4">
              No restaurants yet. Run <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">npm run seed</code> in the server folder.
            </p>
          )}
          {!restLoading && restaurants.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {restaurants.map((r) => (
                  <Link
                    key={r._id}
                    to={`/restaurants/${r._id}`}
                    className="bg-white rounded-xl shadow border border-gray-100 p-4 hover:shadow-md transition-shadow block"
                  >
                    <div className="h-28 bg-gray-100 rounded-lg mb-3" />
                    <h3 className="font-semibold text-gray-900">{r.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{r.cuisine?.join(', ') || '—'}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      ⭐ {r.rating?.toFixed(1) || 'New'} • Delivery ₹{r.deliveryFee ?? 0}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-5">
                <Link to="/restaurants" className="text-primary font-medium text-sm hover:underline">
                  View all restaurants →
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;


