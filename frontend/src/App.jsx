import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/PublicSpace/Home';
import GalerieFilms from './pages/PublicSpace/GalerieFilms';
import DepositFilm from './pages/Users/DepositFilm';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import Profile from './pages/Users/Profile';
import ForgotPassword from './pages/Users/ForgotPassword';
import ResetPassword from './pages/Users/ResetPassword';
import WatchFilm from './pages/PublicSpace/WatchFilm';
import AdminEvents from './pages/Admin/AdminEvents';
import AdminSponsors from './pages/Admin/AdminSponsors';
import AdminLayout from './components/admin/AdminLayout';
import { useAuth } from './context/AuthContext';

const AdminEventsProtected = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const canAccess = isAdmin || isSuperAdmin;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!canAccess) return <Navigate to={ROUTES.PROFILE} replace />;
  return (
    <AdminLayout>
      <AdminEvents />
    </AdminLayout>
  );
};

const AdminSponsorsProtected = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const canAccess = isAdmin || isSuperAdmin;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!canAccess) return <Navigate to={ROUTES.PROFILE} replace />;
  return (
    <AdminLayout>
      <AdminSponsors />
    </AdminLayout>
  );
};

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.GALERIE_FILMS} element={<GalerieFilms />} />
        <Route path={ROUTES.DEPOSER_UN_FILM} element={<DepositFilm />} />
        <Route path={ROUTES.REGISTER_USER} element={<RegisterForm/>}/>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.WATCH_FILM} element={<WatchFilm />} />
        <Route path={ROUTES.ADMIN_EVENTS} element={<AdminEventsProtected />} />
        <Route path={ROUTES.ADMIN_SPONSORS} element={<AdminSponsorsProtected />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
