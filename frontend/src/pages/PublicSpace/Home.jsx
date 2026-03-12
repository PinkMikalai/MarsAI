import React from 'react';
import Hero from '../../components/home/Hero';
import Features from '../../components/home/Features';
import ObjectifsFestival from '../../components/home/ObjectifsFestival';
import ProtocoleTemporel from '../../components/home/ProtocoleTemporel';
import CmsPhases from '../../components/home/CmsPhases';
import ConferencesGratuites from '../../components/home/ConferencesGratuites';
import LaPlateforme from '../../components/home/LaPlateforme';
import ChiffresProjetes from '../../components/home/ChiffresProjetes';
import Sponsors from '../../components/home/Sponsors';
import JuryPreview from '../../components/home/JuryPreview';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <CmsPhases />
      <Features />
      <ObjectifsFestival />
      <ProtocoleTemporel />
      <ConferencesGratuites />
      <LaPlateforme />
      <ChiffresProjetes />
      <JuryPreview />
      <Sponsors />
      <Footer />
    </div>
  );
};

export default Home;
