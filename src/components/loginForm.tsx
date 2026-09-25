import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const auth = useAuth()

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatus('Wysyłanie danych...');

    try {
        await auth.login({ email, password });
        setStatus('Zalogowano pomyślnie!');
    } catch (error: any) {
        if (error.response) {
            const statusCode = error.response.status;
            const errorMessage = error.response.data?.message || 'Nieprawidłowy email lub hasło.';
            setStatus(`Błąd (${statusCode}): ${errorMessage}`);
        } else if (error.request) {
            setStatus('Brak połączenia z serwerem. Spróbuj ponownie później.');
        } else {
            setStatus('Wystąpił nieoczekiwany błąd.');
        }
    };
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Logowanie</h2>

      {status && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200">
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adres e-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasło
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 mt-2"
        >
          Zaloguj się
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
        <div>
          Nie masz konta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Zarejestruj się
          </Link>
        </div>
        <div>
          <Link to="/" className="text-gray-500 hover:underline text-xs">
            ← Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
};