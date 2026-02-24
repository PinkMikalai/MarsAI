import React from 'react';
import { useTranslation } from 'react-i18next';
import FormCard from './FormCard';
import { useDepositForm } from '../../context/DepositFormContext';
import Checkbox from '../ui/forms/Checkbox';

const ConsentStep = () => {
  const { t } = useTranslation();
  const { form, setConsent, setSubscribeNewsletter } = useDepositForm();
  const { accept_rules, accept_ownership, accept_age_18 } = form.consent;

  const handleAcceptRules = (checked) => {
    setConsent('accept_rules', checked);
    setConsent('accept_ownership', checked);
  };

  const CONDITIONS = [
    t('deposit.condition1'),
    t('deposit.condition2'),
    t('deposit.condition3'),
    t('deposit.condition4'),
    t('deposit.condition5'),
  ];

  const FORMATS_GUIDE = [
    {
      title: t('deposit.formatVideoTitle'),
      items: [t('deposit.formatVideoItem1'), t('deposit.formatVideoItem2'), t('deposit.formatVideoItem3')],
    },
    {
      title: t('deposit.formatCoverTitle'),
      items: [t('deposit.formatCoverItem1'), t('deposit.formatCoverItem2'), t('deposit.formatCoverItem3')],
    },
    {
      title: t('deposit.formatSubtitlesTitle'),
      items: [t('deposit.formatSubtitlesItem1'), t('deposit.formatSubtitlesItem2')],
    },
    {
      title: t('deposit.formatStillsTitle'),
      items: [t('deposit.formatStillsItem1'), t('deposit.formatStillsItem2')],
    },
    {
      title: t('deposit.formatDocsTitle'),
      items: [
        t('deposit.formatDocsItem1'),
        t('deposit.formatDocsItem2'),
        t('deposit.formatDocsItem3'),
        t('deposit.formatDocsItem4'),
        t('deposit.formatDocsItem5'),
        t('deposit.formatDocsItem6'),
      ],
    },
  ];

  return (
    <FormCard number="01" title={t('deposit.consentTitle')}>
      <section className="deposit-formats-guide" aria-labelledby="deposit-formats-title">
        <h2 id="deposit-formats-title" className="deposit-formats-guide-title">
          {t('deposit.prepareDocsTitle')}
        </h2>
        <p className="deposit-formats-guide-intro">
          {t('deposit.prepareDocsIntro')}
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

      <h3 className="deposit-conditions-title">{t('deposit.conditionsTitle')}</h3>

      <ul className="deposit-conditions-list">
        {CONDITIONS.map((text, i) => (
          <li key={i}>{text}</li>
        ))}
      </ul>

      <div className="deposit-field-group">
        <Checkbox
          id="accept_age_18"
          label={t('deposit.acceptAge18')}
          checked={accept_age_18}
          onChange={(checked) => setConsent('accept_age_18', checked)}
          required
        />
      </div>

      <div className="deposit-field-group">
        <Checkbox
          id="accept_rules"
          label={t('deposit.acceptRules')}
          checked={accept_rules}
          onChange={handleAcceptRules}
          required
        />
      </div>

      <div className="deposit-field-group">
        <Checkbox
          id="subscribe_newsletter"
          label={t('deposit.subscribeNewsletter')}
          checked={form.subscribe_newsletter}
          onChange={setSubscribeNewsletter}
        />
      </div>
    </FormCard>
  );
};

export default ConsentStep;
