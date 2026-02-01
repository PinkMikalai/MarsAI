import React from 'react';
import Icons from './Icons';

const UploadBox = ({ label, uploadLabel, hint }) => {
  return (
    <div className="deposit-field-group">
      <label className="deposit-field-label">{label}</label>
      <div className="deposit-upload-vignette">
        <div className="deposit-upload-vignette-icon" aria-hidden><Icons.Upload /></div>
        <span className="deposit-field-label deposit-field-label--hint">{hint || 'haute résolution'}</span>
        <button type="button" className="deposit-upload-btn">
          {uploadLabel || 'PNG ou JPG • Max 15Mo'}
        </button>
      </div>
    </div>
  );
};

export default UploadBox;
