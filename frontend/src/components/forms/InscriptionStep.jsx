import React from 'react';
import FormCard from './FormCard';
import Icons from '../ui/common/Icons';
import { useDepositForm } from '../../context/DepositFormContext';
import { CIVILITY_OPTIONS, COUNTRIES_ISO3166 } from '../../constants/submitForm';

const InscriptionStep = () => {
  const { form, setParticipant } = useDepositForm();
  const p = form.participant;

  const handleBirthdateChange = (e) => {
    setParticipant('birthdate', e.target.value);
  };

  const handlePhoneChange = (e) => {
    setParticipant('phone', e.target.value);
  };

  return (
    <FormCard number="02" title="Inscription">
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
        <p className="deposit-info-box-text">
          Renseignez vos informations personnelles. Tous les champs marqués d&apos;une étoile (*) sont obligatoires.
        </p>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Civilité *</label>
          <div className="deposit-field-wrap">
            <select
              className="deposit-input"
              value={p.civility}
              onChange={(e) => setParticipant('civility', e.target.value)}
            >
              {CIVILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Prénom *</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              placeholder="Jean"
              value={p.firstname}
              onChange={(e) => setParticipant('firstname', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Nom *</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              placeholder="Dupont"
              value={p.lastname}
              onChange={(e) => setParticipant('lastname', e.target.value)}
            />
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Email *</label>
          <div className="deposit-field-wrap">
            <input
              type="email"
              className="deposit-input"
              placeholder="jean.dupont@example.com"
              value={p.email}
              onChange={(e) => setParticipant('email', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Date de naissance * (YYYY-MM-DD)</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              placeholder="1990-01-15"
              value={p.birthdate}
              onChange={handleBirthdateChange}
            />
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Pays *</label>
          <div className="deposit-field-wrap">
            <select
              className="deposit-input"
              value={p.country}
              onChange={(e) => setParticipant('country', e.target.value)}
            >
              {COUNTRIES_ISO3166.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Téléphone * (E.164)</label>
          <div className="deposit-field-wrap">
            <input
              type="tel"
              className="deposit-input"
              placeholder="+33612345678"
              value={p.phone}
              onChange={handlePhoneChange}
            />
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Adresse *</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              placeholder="123 rue de la République, 75001 Paris"
              value={p.address}
              onChange={(e) => setParticipant('address', e.target.value)}
            />
          </div>
        </div>
      </div>
    </FormCard>
  );
};

export default InscriptionStep;
