import React from 'react';
import FormCard from './FormCard';

const Step4 = () => {
  return (
    <FormCard number="04" title="Composition de l'Équipe">
      <div className="deposit-field-group">
        <div className="deposit-grid-4">
          <div className="deposit-field-group deposit-field-group--no-margin">
            <label className="deposit-field-label deposit-field-label--jakarta">civilité*</label>
            <div className="deposit-searchbar deposit-searchbar--compact">
              <span className="deposit-searchbar-value">M.</span>
              <span className="deposit-searchbar-chevron" aria-hidden>▼</span>
            </div>
          </div>
          <div className="deposit-field-group deposit-field-group--no-margin">
            <label className="deposit-field-label deposit-field-label--jakarta">prénom et nom</label>
            <div className="deposit-searchbar">
              <input type="text" placeholder="EX: JEAN DUPOND" className="deposit-input deposit-searchbar-input-reset" />
            </div>
          </div>
          <div className="deposit-field-group deposit-field-group--no-margin">
            <label className="deposit-field-label deposit-field-label--jakarta">Profession*</label>
            <div className="deposit-searchbar">
              <input type="text" placeholder="" className="deposit-input" />
            </div>
          </div>
          <div className="deposit-field-group deposit-field-group--no-margin">
            <label className="deposit-field-label deposit-field-label--jakarta">email*</label>
            <div className="deposit-searchbar">
              <input type="email" placeholder="" className="deposit-input" />
            </div>
          </div>
        </div>
        <button type="button" className="deposit-btn-collab deposit-btn-collab--top">
          + ajouter collaborateur
        </button>
      </div>

      <div className="deposit-certificate">
        <div className="deposit-certificate-icon" aria-hidden>🔒</div>
        <h3 className="deposit-certificate-title">Certificat de Propriété</h3>
        <p className="deposit-certificate-text">
          En soumettant ce dossier, vous certifiez sur l&apos;honneur être l&apos;auteur original de l&apos;œuvre et détenir l&apos;intégralité des droits de diffusion. Vous acceptez que MARS.A.I utilise ces éléments pour la promotion du festival.
        </p>
      </div>
    </FormCard>
  );
};

export default Step4;
