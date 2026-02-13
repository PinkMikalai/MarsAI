import React from 'react';
import FormCard from './FormCard';
import { useDepositForm } from '../../context/DepositFormContext';
import Checkbox from '../ui/forms/Checkbox';

const CONDITIONS = [
  'Courts-métrages de 30 secondes minimum à 120 secondes maximum',
  'Création assistée par IA dans au moins une phase de production',
  'Production datant de 2025 ou 2026',
  'Première soumission au festival marsAI',
  'Toutes langues acceptées (sous-titres anglais ou français requis)',
];

const FORMATS_GUIDE = [
  { title: 'Vidéo du film', items: ['Formats acceptés : MP4, MOV, WebM', 'Poids maximum : 300 Mo', 'Durée : entre 30 secondes et 2 minutes (120 s)'] },
  { title: 'Vignette (cover)', items: ['Formats : JPG, JPEG ou PNG', 'Poids maximum : 5 Mo', 'Recommandé : 1280×720 pixels (16:9)'] },
  { title: 'Sous-titres (optionnel)', items: ['Format : fichier SRT', 'Langue : français ou anglais recommandé'] },
  { title: 'Stills (optionnel)', items: ['Jusqu’à 3 images (JPG/PNG)', 'Extraits ou visuels du film'] },
  { title: 'Documents à préparer', items: ['Titre du film (français et anglais)', 'Synopsis (français et anglais, max 500 caractères)', 'Vos infos : civilité, nom, prénom, email, date de naissance, pays, téléphone, téléphone fixe (optionnel), adresse', 'Réseaux : un lien vers votre site ou profil (optionnel)', 'Classification : Hybrid ou 100 % AI', 'Tags (mots-clés) pour le référencement'] },
];

const ConsentStep = () => {
  const { form, setConsent, setSubscribeNewsletter } = useDepositForm();
  const { accept_rules, accept_ownership, accept_age_18 } = form.consent;

  const handleAcceptRules = (checked) => {
    setConsent('accept_rules', checked);
    setConsent('accept_ownership', checked);
  };

  return (
    <FormCard number="01" title="Conditions">
      <section className="deposit-formats-guide" aria-labelledby="deposit-formats-title">
        <h2 id="deposit-formats-title" className="deposit-formats-guide-title">
          Préparer vos documents et fichiers
        </h2>
        <p className="deposit-formats-guide-intro">
          Avant de commencer, assurez-vous d’avoir sous la main les fichiers et informations suivants (formats recommandés) :
        </p>
        <ul className="deposit-formats-guide-list">
          {FORMATS_GUIDE.map((block, i) => (
            <li key={i} className="deposit-formats-guide-block">
              <strong className="deposit-formats-guide-block-title">{block.title}</strong>
              <ul>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <h3 className="deposit-conditions-title">CONDITIONS</h3>

      <ul className="deposit-conditions-list">
        {CONDITIONS.map((text, i) => (
          <li key={i}>{text}</li>
        ))}
      </ul>

      <div className="deposit-field-group">
        <Checkbox
          id="accept_age_18"
          label="Je certifie avoir 18 ans ou plus *"
          checked={accept_age_18}
          onChange={(checked) => setConsent('accept_age_18', checked)}
          required
        />
      </div>

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
