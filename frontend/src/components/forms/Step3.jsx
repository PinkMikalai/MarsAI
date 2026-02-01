import React from 'react';
import FormCard from './FormCard';
import FieldInput from '../ui/FieldInput';
import UploadBox from '../ui/UploadBox';

const Step3 = () => {
  return (
    <FormCard number="03" title="Livrables & Accessibilité">
      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">Lien youtube ( public / non repertorié) * :</label>
          <div className="deposit-field-wrap">
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="deposit-input"
            />
          </div>
        </div>

        <div className="deposit-field-group">
          <label className="deposit-field-label">Sous-titres (.srt)</label>
          <div className="deposit-checkbox-wrap">
            <input type="checkbox" className="deposit-checkbox" id="subtitles" />
            <label htmlFor="subtitles" className="deposit-checkbox-label">
              Voix ou textes nécessitant des sous-titres
            </label>
          </div>
          <div className="deposit-field-wrap deposit-field-wrap--row">
            <span className="deposit-input deposit-input--placeholder-text">Choisir un fichier.srt</span>
            <span className="deposit-upload-arrow" aria-hidden>↑</span>
          </div>
        </div>
      </div>

      <div className="deposit-grid-2 deposit-grid-2--top">
        <UploadBox
          label="Vignette Officielle (16:9) *"
          uploadLabel="PNG ou JPG • Max 15Mo"
          hint="haute résolution"
        />
        <div className="deposit-field-group">
          <label className="deposit-field-label">Galerie Médias (Stills - Max 3)</label>
          <div className="deposit-upload-gallery">
            {[1, 2, 3].map((i) => (
              <div key={i} className="deposit-upload-gallery-item">
                <span aria-hidden className="deposit-upload-gallery-placeholder deposit-upload-gallery-placeholder--large">🖼</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormCard>
  );
};

export default Step3;
