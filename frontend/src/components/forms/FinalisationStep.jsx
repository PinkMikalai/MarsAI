import React, { useState } from 'react';
import FormCard from './FormCard';
import { useDepositForm } from '../../context/DepositFormContext';
import Icons from '../ui/common/Icons';
import { buildSubmitFormData, submitVideo } from '../../service/videoService';

const FinalisationStep = ({ onSuccess, onError }) => {
  const { form, addCollaborator, updateCollaborator, removeCollaborator } = useDepositForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = buildSubmitFormData(form);
      const token = localStorage.getItem('token') || '';
      
      console.log('📤 Envoi des données...');
      const result = await submitVideo(formData, token || undefined);
      
      if (result?.videoId) {
        console.log('✅ Vidéo enregistrée avec succès, ID:', result.videoId);
        onSuccess?.(result);
      } else {
        console.warn('⚠️ Réponse reçue mais pas de videoId:', result);
        onError?.({ message: 'La vidéo n\'a pas pu être enregistrée correctement.' });
      }
    } catch (err) {
      console.error('❌ Erreur lors de l\'envoi:', err);
      if (err.response?.status === 400 && err.response?.data?.errors) {
        // Erreurs de validation Zod
        const errors = err.response.data.errors;
        const errorMessages = errors.map(e => `${e.path?.join('.')}: ${e.message}`).join('\n');
        onError?.({ 
          message: 'Erreurs de validation',
          errors: errorMessages,
          details: errors
        });
      } else {
        onError?.(err.response?.data || err.message || err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormCard number="04" title="Finalisation">
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
        <p className="deposit-info-box-text">
          Ajoutez les collaborateurs puis finalisez votre soumission.
        </p>
      </div>

      {form.collaborators.map((col, index) => (
        <div key={index} className="deposit-field-group deposit-collab-row">
          <div className="deposit-grid-3">
            <div className="deposit-field-group deposit-field-group--no-margin">
              <label className="deposit-field-label deposit-field-label--jakarta">Prénom et nom *</label>
              <div className="deposit-field-wrap">
                <input
                  type="text"
                  className="deposit-input"
                  placeholder="Marie Martin"
                  value={col.fullname}
                  onChange={(e) => updateCollaborator(index, 'fullname', e.target.value)}
                />
              </div>
            </div>
            <div className="deposit-field-group deposit-field-group--no-margin">
              <label className="deposit-field-label deposit-field-label--jakarta">Profession *</label>
              <div className="deposit-field-wrap">
                <input
                  type="text"
                  className="deposit-input"
                  placeholder="Sound Designer"
                  value={col.profession}
                  onChange={(e) => updateCollaborator(index, 'profession', e.target.value)}
                />
              </div>
            </div>
            <div className="deposit-field-group deposit-field-group--no-margin deposit-field-group--inline">
              <div className="deposit-field-group--flex-1">
                <label className="deposit-field-label deposit-field-label--jakarta">Email *</label>
                <div className="deposit-field-wrap">
                  <input
                    type="email"
                    className="deposit-input"
                    placeholder="marie@example.com"
                    value={col.email}
                    onChange={(e) => updateCollaborator(index, 'email', e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="deposit-btn-collab deposit-btn-collab--compact"
                onClick={() => removeCollaborator(index)}
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="deposit-btn-collab" onClick={addCollaborator}>
        + ajouter collaborateur
      </button>

      <div className="deposit-certificate deposit-certificate--spaced">
        <div className="deposit-certificate-icon" aria-hidden><Icons.Lock /></div>
        <h3 className="deposit-certificate-title">Certificat de propriété</h3>
        <p className="deposit-certificate-text">
          En soumettant ce dossier, vous certifiez sur l&apos;honneur être l&apos;auteur original de l&apos;œuvre et détenir l&apos;intégralité des droits de diffusion. Vous acceptez que MARS.A.I utilise ces éléments pour la promotion du festival.
        </p>
      </div>

      <button
        type="button"
        className="deposit-btn-submit deposit-btn-submit-wrap"
        disabled={submitting}
        onClick={handleSubmit}
      >
        {submitting ? 'Envoi en cours...' : 'FINALISER MA SOUMISSION'}
      </button>
    </FormCard>
  );
};

export default FinalisationStep;
