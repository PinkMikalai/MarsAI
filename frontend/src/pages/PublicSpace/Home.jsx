import React from 'react';
import Hero from '../../components/home/Hero';
import LaPlateforme from '../../components/home/LaPlateforme';
import Sponsors from '../../components/home/Sponsors';
import JuryPreview from '../../components/home/JuryPreview';
import CmsPhases from '../../components/home/CmsPhases';
import PrixSection from '../../components/home/PrixSection';
import Footer from '../../components/layout/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <PrixSection />
      <CmsPhases />
      <JuryPreview />
      <LaPlateforme />
      <Sponsors />
      <Footer />
    </div>
  );
};

export default Home;
