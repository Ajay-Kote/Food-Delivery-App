import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Profile</h1>
      <div className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {user.role}
        </p>
        {!user.isApproved && user.role !== 'customer' && (
          <p className="text-xs text-yellow-600">
            Your account is pending admin approval. You&apos;ll get access once approved.
          </p>
        )}
        <button
          onClick={logout}
          className="mt-3 bg-gray-800 text-white text-xs px-4 py-2 rounded hover:bg-black"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;



