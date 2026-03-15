import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api.js';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    };
    fetch();
  }, []);

  const toggleApprove = async (userId, current) => {
    const res = await api.patch(`/admin/approve/${userId}`, { isApproved: !current });
    setUsers((prev) => prev.map((u) => (u._id === userId ? res.data.data : u)));
    toast.success('Updated approval');
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Manage users</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {users.map((u) => (
          <div key={u._id} className="flex justify-between items-center p-3 text-sm">
            <div>
              <p className="font-semibold">
                {u.name}{' '}
                <span className="ml-1 text-xs text-gray-500">({u.role})</span>
              </p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
            {u.role !== 'customer' && u.role !== 'admin' && (
              <button
                onClick={() => toggleApprove(u._id, u.isApproved)}
                className={`text-xs px-3 py-1 rounded ${
                  u.isApproved ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}
              >
                {u.isApproved ? 'Revoke' : 'Approve'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;



