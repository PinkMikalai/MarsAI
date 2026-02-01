import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import Home from './pages/PublicSpace/Home';
import DepositFilm from './pages/Users/DepositFilm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.DEPOSER_UN_FILM} element={<DepositFilm />} />
      </Routes>
    </Router>
  );
}

export default App;
