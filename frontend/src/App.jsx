import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/PublicSpace/Home';
import GalleryFilms from './pages/PublicSpace/GalleryFilms';
import DepositFilm from './pages/Users/DepositFilm';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import Profile from './pages/Users/Profile';
import ForgotPassword from './pages/Users/ForgotPassword';
import ResetPassword from './pages/Users/ResetPassword';
import WatchFilm from './pages/PublicSpace/WatchFilm';
import JuryPage from './pages/PublicSpace/JuryPage';
import EventsPage from './pages/PublicSpace/EventsPage';
import AdminEvents from './pages/Admin/AdminEvents';
import AdminSponsors from './pages/Admin/AdminSponsors';
import AdminJury from './pages/Admin/AdminJury';
import AdminInvitations from './pages/Admin/AdminInvitations';
import AdminLayout from './components/admin/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';
import AdminAssignment from './pages/Admin/AdminAssignments';
import { useAuth } from './context/AuthContext';
import UpdatePassword from './pages/Users/updatePassword';



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

const AdminJuryProtected = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const canAccess = isAdmin || isSuperAdmin;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!canAccess) return <Navigate to={ROUTES.PROFILE} replace />;
  return (
    <AdminLayout>
      <AdminJury />
    </AdminLayout>
  );
};

const AdminInvitationsProtected = () => {
  const { user, isSuperAdmin } = useAuth();
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!isSuperAdmin) return <Navigate to={ROUTES.PROFILE} replace />;
  return (
    <AdminLayout>
      <AdminInvitations />
    </AdminLayout>
  );
};

const PrivateRoute = ({children}) =>{
  const {user} = useAuth();
  return user ? children : <Navigate to={ROUTES.LOGIN} replace />
}

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.GALLERY_FILMS} element={<PublicLayout><GalleryFilms /></PublicLayout>} />
        <Route path={ROUTES.PARTICIPATE} element={<DepositFilm />} />
        <Route path={ROUTES.REGISTER_USER} element={<RegisterForm/>}/>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.UPDATE_PASSWORD} element={<PrivateRoute><UpdatePassword /></PrivateRoute>} />
        <Route path={ROUTES.PROFILE} element={<PrivateRoute><PublicLayout><Profile /></PublicLayout></PrivateRoute>} />
        <Route path={ROUTES.WATCH_FILM} element={<WatchFilm />} />
        <Route path={ROUTES.JURY} element={<PublicLayout><JuryPage /></PublicLayout>} />
        <Route path={ROUTES.EVENTS} element={<PublicLayout><EventsPage /></PublicLayout>} />
        <Route path={ROUTES.ADMIN_EVENTS} element={<AdminEventsProtected />} />
        <Route path={ROUTES.ADMIN_SPONSORS} element={<AdminSponsorsProtected />} />
        <Route path={ROUTES.ADMIN_ASSIGNMENT} element={<AdminAssignment/>} />
        <Route path={ROUTES.ADMIN_JURY} element={<AdminJuryProtected />} />
        <Route path={ROUTES.ADMIN_INVITATIONS} element={<AdminInvitationsProtected />} />

      </Routes>

    </Router>
    </AuthProvider>
  );
}

export default App;
