import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginForm } from './components/loginForm';
import { RegisterForm } from './components/registerForm';
import { ProtectedRoute } from './components/protectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Strona główna */}
        <Route path="/" element={<HomePage />} />

        {/* Route logowania */}
        <Route
          path="/login"
          element={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
              <LoginForm />
            </div>
          }
        />

        {/* Route rejestracji */}
        <Route
          path="/register"
          element={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
              <RegisterForm />
            </div>
          }
        />
        <Route
          path="/protected"
          element={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
              <ProtectedRoute />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;