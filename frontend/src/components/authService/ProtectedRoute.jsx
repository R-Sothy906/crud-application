import { Navigate, Outlet } from 'react-router-dom';

import useAuthStore from '../../store/authStore.js';

const ProtectedRoute = () => {

const {
  isAuthenticated,
  checkingAuth
} = useAuthStore();
if (checkingAuth) {
  return <div>Checking authentication...</div>;
}
if (!isAuthenticated) {
  return <Navigate to="/" replace />;
}
return <Outlet />;
};
export default ProtectedRoute;