import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/authService/ProtectedRoute.jsx';
import PublicRoute from './components/authService/publicRoute.jsx';
import Task from './pages/layout/Task.jsx'
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import useAuthStore from './store/authStore.js';
import './App.css';
function App() {
  const getCurrentUser = useAuthStore(
    (state) => state.getCurrentUser
  );
  useEffect(() => {
    console.log('Checking current user...');
    getCurrentUser();
  }, [getCurrentUser]);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/tasks"
            element={<Task/>}
          />
        </Route>
        <Route
          path="*"
          element={<div>Page Not Found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;