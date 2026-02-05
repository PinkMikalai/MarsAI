import React from 'react';
import FormCard from './FormCard';
import { useDepositForm } from '../../context/DepositFormContext';
import Icons from '../ui/common/Icons';
import Checkbox from '../ui/forms/Checkbox';

const CONDITIONS = [
  'Courts-métrages de 30 secondes minimum à 120 secondes maximum',
  'Création assistée par IA dans au moins une phase de production',
  'Production datant de 2025 ou 2026',
  'Première soumission au festival marsAI',
  'Toutes langues acceptées (sous-titres anglais ou français requis)',
];

const ConsentStep = () => {
  const { form, setConsent, setSubscribeNewsletter } = useDepositForm();
  const { accept_rules, accept_ownership } = form.consent;

  const handleAcceptRules = (checked) => {
    setConsent('accept_rules', checked);
    setConsent('accept_ownership', checked);
  };

  return (
    <FormCard number="01" title="Conditions">
      <h3 className="deposit-conditions-title">CONDITIONS</h3>

      <ul className="deposit-conditions-list">
        {CONDITIONS.map((text, i) => (
          <li key={i}>{text}</li>
        ))}
      </ul>

      <div className="deposit-field-group">
        <Checkbox
          id="accept_rules"
          label="J'accepte les conditions du règlement du festival marsAI et certifie que toutes les informations fournies sont exactes."
          checked={accept_rules}
          onChange={handleAcceptRules}
          required
        />
      </div>

      <div className="deposit-field-group">
        <Checkbox
          id="subscribe_newsletter"
          label="Je souhaite m'inscrire à la newsletter marsAI pour recevoir les dernières actualités du festival."
          checked={form.subscribe_newsletter}
          onChange={setSubscribeNewsletter}
        />
      </div>
    </FormCard>
  );
};

export default ConsentStep;
