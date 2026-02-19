import React, { useEffect, useState } from 'react';
import { sponsorService } from '../../service/sponsorService';

const getClearbitLogoUrl = (url) => {
  if (!url?.trim()) return null;
  try {
    const hostname = new URL(url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`).hostname.replace(/^www\./, '');
    return `https://logo.clearbit.com/${hostname}`;
  } catch {
    return null;
  }
};

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [failedLogos, setFailedLogos] = useState(new Set());

  useEffect(() => {
    sponsorService
      .getAll()
      .then((res) => {
        const list = res?.sponsors ?? [];
        setSponsors(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(err?.message || 'Erreur lors du chargement des partenaires.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoError = (id) => {
    setFailedLogos((prev) => new Set(prev).add(id));
  };

  return (
    <section className="home-section home-sponsors" aria-label="Partenaires">
      <div className="home-container home-sponsors-container">
        <h2 className="home-section-title home-sponsors-title">
          ILS SOUTIENNENT <span className="home-section-title-blue">LE FUTUR</span>
        </h2>
        {loading && <p className="home-sponsors-loading">Chargement des partenaires…</p>}
        {error && <p className="home-sponsors-error">{error}</p>}
        {!loading && !error && sponsors.length > 0 && (
          <div className="home-sponsors-grid">
            {sponsors.map((sponsor) => {
              const uploadedImg = sponsor.img ? sponsorService.getSponsorImageUrl(sponsor.img) : null;
              const clearbitUrl = getClearbitLogoUrl(sponsor.url);
              const useClearbit = !uploadedImg && clearbitUrl && !failedLogos.has(`clearbit-${sponsor.id}`);
              const imageUrl = uploadedImg || (useClearbit ? clearbitUrl : null);
              const showName = !imageUrl || failedLogos.has(`img-${sponsor.id}`);
              const linkUrl = sponsor.url?.trim() || null;
              const name = sponsor.name || 'Partenaire';

              const content = (
                <>
                  {imageUrl && !showName ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="home-sponsor-img"
                      onError={() => handleLogoError(useClearbit ? `clearbit-${sponsor.id}` : `img-${sponsor.id}`)}
                    />
                  ) : (
                    <span className="home-sponsor-name">{name}</span>
                  )}
                </>
              );

              return (
                <div key={sponsor.id} className="home-sponsor-card">
                  {linkUrl ? (
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="home-sponsor-link"
                      aria-label={`${name} - ouvrir le site`}
                    >
                      {content}
                    </a>
                  ) : (
                    <span className="home-sponsor-link">{content}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!loading && !error && sponsors.length === 0 && (
          <p className="home-sponsors-empty">Aucun partenaire pour le moment.</p>
        )}
      </div>
    </section>
  );
};

export default Sponsors;
