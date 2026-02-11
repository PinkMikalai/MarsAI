import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import Home from './pages/PublicSpace/Home';
import GalerieFilms from './pages/PublicSpace/GalerieFilms';
import DepositFilm from './pages/Users/DepositFilm';
import Profile from './pages/Users/Profile';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import WatchFilm from './pages/PublicSpace/WatchFilm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.GALERIE_FILMS} element={<GalerieFilms />} />
        <Route path={ROUTES.DEPOSER_UN_FILM} element={<DepositFilm />} />
        <Route path={ROUTES.REGISTER_USER} element={<RegisterForm/>}/>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.WATCH_FILM} element={<WatchFilm />} />
      </Routes>
    </Router>
  );
}

export default App;
