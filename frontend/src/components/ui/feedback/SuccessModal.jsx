import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icons from '../common/Icons';
import '../../../styles/components/success-modal.css';

const SuccessModal = ({ isOpen, onClose, videoId, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="success-modal-overlay"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
          >
            <div className="success-modal-content">
              {/* Icône de succès */}
              <div className="success-modal-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Titre */}
              <h2 id="success-modal-title" className="success-modal-title">
                Félicitations ! 🎉
              </h2>
              
              {/* Message de validation */}
              <p className="success-modal-message">
                {message || 'Votre participation a bien été enregistrée : le film est enregistré dans notre base de données et a été envoyé sur la chaîne YouTube du festival.'}
              </p>
              
              {/* ID de la vidéo (pour confirmation) */}
              {videoId && (
                <p className="success-modal-video-id">
                  <strong>Référence de votre vidéo :</strong> #{videoId}
                </p>
              )}
              
              {/* Bouton de fermeture */}
              <button
                onClick={onClose}
                className="success-modal-button"
                aria-label="Fermer"
              >
                Parfait, merci !
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
