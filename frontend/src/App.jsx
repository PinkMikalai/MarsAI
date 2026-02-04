import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import Home from './pages/PublicSpace/Home';
import GalerieFilms from './pages/PublicSpace/GalerieFilms';
import DepositFilm from './pages/Users/DepositFilm';
import LoginAdmin from './pages/Admin/LoginAdmin';
import InscriptionAdmin from './pages/Admin/InscriptionAdmin';
import RegisterForm from './components/auth/RegisterForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.GALERIE_FILMS} element={<GalerieFilms />} />
        <Route path={ROUTES.DEPOSER_UN_FILM} element={<DepositFilm />} />
        <Route path={ROUTES.REGISTER_USER} element={<RegisterForm/>}/>
        <Route path={ROUTES.ADMIN_LOGIN} element={<LoginAdmin />} />
        {/* <Route path={ROUTES.ADMIN_INSCRIPTION} element={<InscriptionAdmin />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
