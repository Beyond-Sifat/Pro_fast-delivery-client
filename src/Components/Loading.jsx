import { FaSpinner } from 'react-icons/fa';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full text-center">
      <FaSpinner className="animate-spin text-primary text-4xl mb-4" />
      <p className="text-lg font-medium text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
