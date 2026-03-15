import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Access denied</h1>
        <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
        <Link
          to="/"
          className="inline-block bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
