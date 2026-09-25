import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Strona Główna</h1>
        <p className="text-gray-600 mb-6">Witaj w naszej aplikacji!</p>
        
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Logowanie
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
          >
            Rejestracja
          </Link>
        </div>
      </div>
    </div>
  );
};