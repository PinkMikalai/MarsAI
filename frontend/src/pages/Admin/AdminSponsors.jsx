import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sponsorService } from '../../service/sponsorService';

const getImageUrl = (filename) => {
  if (!filename) return null;
  return sponsorService.getSponsorImageUrl(filename);
};

const AdminSponsors = () => {
  const { t } = useTranslation();
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadSponsors = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await sponsorService.getAll();
      setSponsors(data.sponsors || []);
    } catch (err) {
      setError(err.message || t('admin.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    const form = e.target;
    const formData = new FormData(form);
    try {
      await sponsorService.create(formData);
      setShowForm(false);
      form.reset();
      loadSponsors();
    } catch (err) {
      setFormError(err.message || t('admin.creationError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setFormError('');
    setSubmitting(true);
    const form = e.target;
    const formData = new FormData(form);
    const sponsor = sponsors.find((s) => s.id === editingId);
    if (sponsor && !formData.get('img')?.name && sponsor.img) {
      formData.set('img', sponsor.img);
    }
    try {
      await sponsorService.update(editingId, formData);
      setEditingId(null);
      loadSponsors();
    } catch (err) {
      setFormError(err.message || t('admin.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteSponsorConfirm'))) return;
    setDeletingId(id);
    try {
      await sponsorService.delete(id);
      setPreviewId(null);
      setEditingId(null);
      loadSponsors();
    } catch (err) {
      setError(err.message || t('admin.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const sponsorPreview = previewId ? sponsors.find((s) => s.id === previewId) : null;
  const sponsorEditing = editingId ? sponsors.find((s) => s.id === editingId) : null;

  return (
    <section className="admin-overview">
      <div className="admin-overview-header">
        <div>
          <p className="admin-overview-kicker">{t('admin.kicker')}</p>
          <h2 className="admin-overview-title">{t('admin.sponsorsTitle')}</h2>
          <p className="admin-overview-text">
            {t('admin.sponsorsSubtitle')}
          </p>
        </div>
        <div className="admin-overview-header-actions">
          <button
            type="button"
            className="admin-profile-btn admin-profile-btn--primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? t('common.cancel') : t('admin.addSponsor')}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-events-form-wrap">
          <h3 className="admin-events-form-title">{t('admin.newSponsorTitle')}</h3>
          <form onSubmit={handleCreateSubmit} className="admin-events-form">
            {formError && !editingId && (
              <p className="admin-events-form-error" role="alert">
                {formError}
              </p>
            )}
            <div className="admin-events-form-grid">
              <label className="admin-events-form-label admin-events-form-label--full">
                {t('admin.sponsorNameField')}
                <input type="text" name="name" required className="admin-events-form-input" placeholder={t('admin.sponsorNamePlaceholder')} />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                {t('admin.sponsorUrlField')}
                <input type="url" name="url" className="admin-events-form-input" placeholder="https://..." />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                {t('admin.sponsorLogoField')}
                <input type="file" name="img" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
              </label>
            </div>
            <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={submitting}>
              {submitting ? t('admin.creating') : t('admin.createSponsor')}
            </button>
          </form>
        </div>
      )}

      {loading && <p className="admin-profile-loading">{t('admin.loadingSponsors')}</p>}
      {error && (
        <p className="admin-events-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="admin-events-list">
          {sponsors.length === 0 ? (
            <p className="admin-events-empty">{t('admin.noSponsors')}</p>
          ) : (
            <div className="admin-events-table-wrap">
              <table className="admin-events-table">
                <thead>
                  <tr>
                    <th className="admin-events-th admin-events-th--img">{t('admin.thPreview')}</th>
                    <th className="admin-events-th">{t('admin.thName')}</th>
                    <th className="admin-events-th">{t('admin.thUrl')}</th>
                    <th className="admin-events-th admin-events-th--actions">{t('admin.thActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor) => (
                    <tr key={sponsor.id} className="admin-events-tr">
                      <td className="admin-events-td admin-events-td--img">
                        <div className="admin-events-thumb">
                          {sponsor.img ? (
                            <img src={getImageUrl(sponsor.img)} alt="" className="admin-events-thumb-img" />
                          ) : (
                            <span className="admin-events-thumb-placeholder">—</span>
                          )}
                        </div>
                      </td>
                      <td className="admin-events-td admin-events-td--title">{sponsor.name || '—'}</td>
                      <td className="admin-events-td">{sponsor.url ? (
                        <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="admin-events-link">{sponsor.url}</a>
                      ) : '—'}</td>
                      <td className="admin-events-td admin-events-td--actions">
                        <button type="button" className="admin-events-btn admin-events-btn--preview" onClick={() => setPreviewId(sponsor.id)}>
                          {t('admin.previewBtn')}
                        </button>
                        <button type="button" className="admin-events-btn admin-events-btn--edit" onClick={() => setEditingId(sponsor.id)}>
                          {t('admin.editBtn')}
                        </button>
                        <button type="button" className="admin-events-btn admin-events-btn--delete" onClick={() => handleDelete(sponsor.id)} disabled={deletingId === sponsor.id}>
                          {deletingId === sponsor.id ? t('admin.deletingBtn') : t('admin.deleteBtn')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {previewId && sponsorPreview && (
        <div className="admin-events-modal-overlay" onClick={() => setPreviewId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-preview-sponsor-title">
          <div className="admin-events-modal admin-events-modal--preview" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-preview-sponsor-title" className="admin-events-modal-title">{t('admin.previewSponsorTitle')}</h3>
            <div className="admin-events-preview-media">
              {sponsorPreview.img ? (
                <img src={getImageUrl(sponsorPreview.img)} alt="" className="admin-events-preview-img" />
              ) : (
                <div className="admin-events-preview-placeholder">{t('admin.noLogo')}</div>
              )}
            </div>
            <dl className="admin-events-preview-dl">
              <dt>{t('admin.thName')}</dt>
              <dd>{sponsorPreview.name}</dd>
              {sponsorPreview.url && (
                <>
                  <dt>{t('admin.thUrl')}</dt>
                  <dd>
                    <a href={sponsorPreview.url} target="_blank" rel="noopener noreferrer" className="admin-events-link">{sponsorPreview.url}</a>
                  </dd>
                </>
              )}
            </dl>
            <button type="button" className="admin-profile-btn admin-profile-btn--primary" onClick={() => setPreviewId(null)}>
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {editingId && sponsorEditing && (
        <div className="admin-events-modal-overlay" onClick={() => setEditingId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-edit-sponsor-title">
          <div className="admin-events-modal admin-events-modal--form" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-edit-sponsor-title" className="admin-events-modal-title">{t('admin.editSponsorTitle')}</h3>
            <form onSubmit={handleEditSubmit} className="admin-events-form">
              {formError && editingId && (
                <p className="admin-events-form-error" role="alert">
                  {formError}
                </p>
              )}
              <div className="admin-events-form-grid">
                <label className="admin-events-form-label admin-events-form-label--full">
                  {t('admin.sponsorNameField')}
                  <input type="text" name="name" required className="admin-events-form-input" defaultValue={sponsorEditing.name} />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  {t('admin.sponsorUrlField')}
                  <input type="url" name="url" className="admin-events-form-input" defaultValue={sponsorEditing.url || ''} placeholder="https://..." />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  {t('admin.sponsorNewLogo')}
                  <input type="file" name="img" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
                </label>
              </div>
              <div className="admin-events-modal-actions">
                <button type="button" className="admin-profile-btn admin-profile-btn--secondary" onClick={() => setEditingId(null)}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={submitting}>
                  {submitting ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminSponsors;
