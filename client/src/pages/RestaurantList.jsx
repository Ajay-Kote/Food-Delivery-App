import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [filters, setFilters] = useState({ cuisine: '', rating: '', veg: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: 1,
          limit: 20,
          ...(filters.cuisine && { cuisine: filters.cuisine }),
          ...(filters.rating && { rating: filters.rating }),
          ...(filters.veg && { veg: filters.veg }),
        }).toString();
        const res = await api.get(`/restaurants?${params}`);
        setRestaurants(res.data.data || []);
      } catch {
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.cuisine, filters.rating, filters.veg]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
      setSearchResults(res.data.data || { restaurants: [], menuItems: [] });
    } catch {
      setSearchResults({ restaurants: [], menuItems: [] });
    }
  };

  const showSearchResults = searchResults && searchQuery.trim().length > 0;
  const list = showSearchResults
    ? [...(searchResults.restaurants || [])]
    : restaurants;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            placeholder="Search restaurants or dishes..."
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value.trim()) setSearchResults(null);
            }}
          />
        </form>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h1 className="text-lg font-semibold text-gray-900">
            {showSearchResults ? `Search: "${searchQuery}"` : 'Restaurants'}
          </h1>
          {!showSearchResults && (
            <div className="flex flex-wrap gap-2">
              <input
                placeholder="Cuisine"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={filters.cuisine}
                onChange={(e) => setFilters((f) => ({ ...f, cuisine: e.target.value }))}
              />
              <input
                placeholder="Min rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={filters.rating}
                onChange={(e) => setFilters((f) => ({ ...f, rating: e.target.value }))}
              />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={filters.veg}
                onChange={(e) => setFilters((f) => ({ ...f, veg: e.target.value }))}
              >
                <option value="">All</option>
                <option value="true">Veg only</option>
              </select>
            </div>
          )}
        </div>

        {loading && !showSearchResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse h-44 bg-gray-200 rounded-xl" />
            ))}
          </div>
        )}

        {!loading && list.length === 0 && (
          <p className="text-gray-500 py-8 text-center">
            {showSearchResults ? 'No restaurants or dishes found.' : 'No restaurants found.'}
          </p>
        )}

        {!loading && list.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {list.map((r) => (
              <Link
                key={r._id}
                to={`/restaurants/${r._id}`}
                className="bg-white rounded-xl shadow border border-gray-100 p-4 hover:shadow-md transition-shadow block"
              >
                <div className="h-28 bg-gray-100 rounded-lg mb-3" />
                <h2 className="font-semibold text-gray-900">{r.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{r.cuisine?.join(', ') || '—'}</p>
                <p className="text-xs text-gray-600 mt-1">
                  ⭐ {r.rating?.toFixed(1) || 'New'} • Delivery ₹{r.deliveryFee ?? 0}
                </p>
              </Link>
            ))}
          </div>
        )}

        {showSearchResults && searchResults.menuItems?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Dishes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {searchResults.menuItems.slice(0, 6).map((item) => (
                <Link
                  key={item._id}
                  to={`/restaurants/${item.restaurantId?._id || item.restaurantId}`}
                  className="bg-white rounded-lg shadow border border-gray-100 p-3 flex gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.restaurantId?.name || 'Restaurant'}</p>
                    <p className="text-sm font-semibold text-primary mt-0.5">₹{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantList;
