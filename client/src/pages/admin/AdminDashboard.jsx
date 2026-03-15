import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, ResponsiveContainer } from 'recharts';
import { api } from '../../utils/api.js';

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get('/admin/dashboard-stats');
      setData(res.data.data);
    };
    fetch();
  }, []);

  if (!data) return <div className="max-w-5xl mx-auto p-4">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Admin dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Total users</p>
          <p className="text-2xl font-bold">{data.stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Total restaurants</p>
          <p className="text-2xl font-bold">{data.stats.totalRestaurants}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Total orders</p>
          <p className="text-2xl font-bold">{data.stats.totalOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs font-semibold mb-2">Orders per day</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.ordersPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#fb641b" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs font-semibold mb-2">Revenue this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.revenueThisWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-xs font-semibold mb-2">Top 5 dishes</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data.topDishes}
            layout="vertical"
            margin={{ left: 80, right: 20, top: 5, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="orderCount" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;



