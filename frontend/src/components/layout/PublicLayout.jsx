/**
 * PublicLayout.jsx — Layout commun pour les pages publiques
 *
 * Inclut automatiquement Navbar + Footer.
 * Ne pas utiliser pour Home (sa Navbar est intégrée dans Hero pour l'overlay vidéo).
 *
 * Usage dans App.jsx :
 *   <Route path={ROUTES.GALLERY_FILMS} element={<PublicLayout><GalleryFilms /></PublicLayout>} />
 */
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = ({ children }) => (
  <div className="public-layout">
    <header className="public-layout__navbar">
      <Navbar />
    </header>
    <main className="public-layout__main">
      {children}
    </main>
    <div className="public-layout__footer">
      <Footer />
    </div>
  </div>
);

export default PublicLayout;
