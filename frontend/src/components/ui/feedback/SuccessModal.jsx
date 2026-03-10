import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Icons from '../common/Icons';
import '../../../styles/components/success-modal.css';

const SuccessModal = ({ isOpen, onClose, videoId, videoTitle, message }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="success-modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="success-modal-content">
              <div className="success-modal-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h2 id="success-modal-title" className="success-modal-title">
                {t('deposit.successModalTitle')}
              </h2>

              <p className="success-modal-message">
                {message || t('deposit.successDefaultMsg')}
              </p>

              {(videoTitle || videoId) && (
                <p className="success-modal-video-id">
                  <strong>{t('deposit.successModalVideoRef')}</strong> {videoTitle || `#${videoId}`}
                </p>
              )}

              <button
                onClick={onClose}
                className="success-modal-button"
                aria-label={t('common.close')}
              >
                {t('deposit.successModalClose')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
