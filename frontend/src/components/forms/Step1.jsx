import React from 'react';
import FormCard from './FormCard';
import FieldInput from '../ui/FieldInput';
import FieldTextArea from '../ui/FieldTextArea';

const Step1 = () => {
  return (
    <FormCard number="01" title="Identitée du film">
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden>i</div>
        <p className="deposit-info-box-text">
          Transmettez les éléments techniques, l&apos;usage de l&apos;IA et la composition de votre équipe. Tous les champs marqués d&apos;une étoile (*) sont obligatoires.
        </p>
      </div>

      <div className="deposit-grid-2">
        <FieldInput label="Titre du court métrage *" placeholder="nom de votre oeuvre" required />
        <FieldInput label="Traduction anglaise *" placeholder="nom de votre oeuvre" required />
      </div>

      <div className="deposit-grid-2">
        <FieldInput label="Durée exacte (en secondes) *" placeholder="Ex : 60 sec" required />
        <FieldInput label="Langue parlée / Principale du film *" placeholder="Langue" required />
      </div>

      <FieldTextArea label="Synopsis langue originale ( max 300 caractères)* :" placeholder="Resumez l'intention de votre film et l'histoire qu'il raconte en quelques lignes ." maxLength={300} required />
      <FieldTextArea label="Synopsis ANGLAIS (max 300 caractères)* :" placeholder="Resumez l'intention de votre film et l'histoire qu'il raconte en quelques lignes ." maxLength={300} required />
    </FormCard>
  );
};

export default Step1;
