import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/ui/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1 className="home-title">
        Bienvenue sur MarsAI
      </h1>
      <p className="home-description">
        L'intelligence artificielle au service de votre créativité cinématographique.
      </p>
      <Button onClick={() => navigate(ROUTES.DEPOSER_UN_FILM)}>
        DÉPOSER UN FILM
      </Button>
    </div>
  );
};

export default Home;
