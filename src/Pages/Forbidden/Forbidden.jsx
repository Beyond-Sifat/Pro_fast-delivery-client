import React from 'react';
import { useNavigate } from 'react-router';
import { FaBan } from 'react-icons/fa';

const Forbidden = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <FaBan className="text-red-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">403 - Forbidden</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        You don’t have permission to access this page. If you think this is a mistake, please contact support or try again with proper access.
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Go Back
        </button>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default Forbidden;
