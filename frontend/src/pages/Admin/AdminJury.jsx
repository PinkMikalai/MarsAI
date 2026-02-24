import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { juryService } from '../../service/juryService';

const getImageUrl = (filename) => {
  if (!filename) return null;
  return juryService.getJuryImageUrl(filename);
};

const truncate = (str, max = 60) => {
  if (!str) return '—';
  return str.length <= max ? str : str.slice(0, max) + '…';
};

const AdminJury = () => {
  const { t } = useTranslation();
  const [jurys, setJurys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadJurys = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await juryService.getAll();
      setJurys(data.jurys || []);
    } catch (err) {
      setError(err.message || t('admin.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJurys();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    const form = e.target;
    const formData = new FormData(form);
    try {
      await juryService.create(formData);
      setShowForm(false);
      form.reset();
      loadJurys();
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
    const jury = jurys.find((j) => j.id === editingId);
    if (jury && !formData.get('illustration')?.name && jury.illustration) {
      formData.set('illustration', jury.illustration);
    }
    try {
      await juryService.update(editingId, formData);
      setEditingId(null);
      loadJurys();
    } catch (err) {
      setFormError(err.message || t('admin.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteJuryConfirm'))) return;
    setDeletingId(id);
    try {
      await juryService.delete(id);
      setPreviewId(null);
      setEditingId(null);
      loadJurys();
    } catch (err) {
      setError(err.message || t('admin.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const juryPreview = previewId ? jurys.find((j) => j.id === previewId) : null;
  const juryEditing = editingId ? jurys.find((j) => j.id === editingId) : null;

  return (
    <section className="admin-overview">
      <div className="admin-overview-header">
        <div>
          <p className="admin-overview-kicker">{t('admin.kicker')}</p>
          <h2 className="admin-overview-title">{t('admin.juryTitle')}</h2>
          <p className="admin-overview-text">
            {t('admin.jurySubtitle')}
          </p>
        </div>
        <div className="admin-overview-header-actions">
          <button
            type="button"
            className="admin-profile-btn admin-profile-btn--primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? t('common.cancel') : t('admin.addMember')}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-events-form-wrap">
          <h3 className="admin-events-form-title">{t('admin.newMemberTitle')}</h3>
          <form onSubmit={handleCreateSubmit} className="admin-events-form">
            {formError && !editingId && (
              <p className="admin-events-form-error" role="alert">
                {formError}
              </p>
            )}
            <div className="admin-events-form-grid">
              <label className="admin-events-form-label">
                {t('admin.juryFirstname')}
                <input type="text" name="firstname" required className="admin-events-form-input" placeholder="Jean" />
              </label>
              <label className="admin-events-form-label">
                {t('admin.juryLastname')}
                <input type="text" name="lastname" required className="admin-events-form-input" placeholder="Dupont" />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                {t('admin.juryBio')}
                <textarea name="bio" rows={4} className="admin-events-form-input" placeholder={t('admin.juryBioPlaceholder')} />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                {t('admin.juryPhoto')}
                <input type="file" name="illustration" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
              </label>
            </div>
            <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={submitting}>
              {submitting ? t('admin.creating') : t('admin.createMember')}
            </button>
          </form>
        </div>
      )}

      {loading && <p className="admin-profile-loading">{t('admin.loadingJury')}</p>}
      {error && (
        <p className="admin-events-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="admin-events-list">
          {jurys.length === 0 ? (
            <p className="admin-events-empty">{t('admin.noJury')}</p>
          ) : (
            <div className="admin-events-table-wrap">
              <table className="admin-events-table">
                <thead>
                  <tr>
                    <th className="admin-events-th admin-events-th--img">{t('admin.thPreview')}</th>
                    <th className="admin-events-th">{t('admin.thFirstname')}</th>
                    <th className="admin-events-th">{t('admin.thLastname')}</th>
                    <th className="admin-events-th">{t('admin.thBio')}</th>
                    <th className="admin-events-th admin-events-th--actions">{t('admin.thActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {jurys.map((jury) => (
                    <tr key={jury.id} className="admin-events-tr">
                      <td className="admin-events-td admin-events-td--img">
                        <div className="admin-events-thumb">
                          {jury.illustration ? (
                            <img src={getImageUrl(jury.illustration)} alt="" className="admin-events-thumb-img" />
                          ) : (
                            <span className="admin-events-thumb-placeholder">—</span>
                          )}
                        </div>
                      </td>
                      <td className="admin-events-td admin-events-td--title">{jury.firstname || '—'}</td>
                      <td className="admin-events-td">{jury.lastname || '—'}</td>
                      <td className="admin-events-td admin-events-td--bio">{truncate(jury.bio, 50)}</td>
                      <td className="admin-events-td admin-events-td--actions">
                        <button type="button" className="admin-events-btn admin-events-btn--preview" onClick={() => setPreviewId(jury.id)}>
                          {t('admin.previewBtn')}
                        </button>
                        <button type="button" className="admin-events-btn admin-events-btn--edit" onClick={() => setEditingId(jury.id)}>
                          {t('admin.editBtn')}
                        </button>
                        <button type="button" className="admin-events-btn admin-events-btn--delete" onClick={() => handleDelete(jury.id)} disabled={deletingId === jury.id}>
                          {deletingId === jury.id ? t('admin.deletingBtn') : t('admin.deleteBtn')}
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

      {previewId && juryPreview && (
        <div className="admin-events-modal-overlay" onClick={() => setPreviewId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-preview-jury-title">
          <div className="admin-events-modal admin-events-modal--preview" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-preview-jury-title" className="admin-events-modal-title">{t('admin.previewMemberTitle')}</h3>
            <div className="admin-events-preview-media">
              {juryPreview.illustration ? (
                <img src={getImageUrl(juryPreview.illustration)} alt="" className="admin-events-preview-img" />
              ) : (
                <div className="admin-events-preview-placeholder">{t('admin.noPhoto')}</div>
              )}
            </div>
            <dl className="admin-events-preview-dl">
              <dt>{t('admin.thFirstname')}</dt>
              <dd>{juryPreview.firstname}</dd>
              <dt>{t('admin.thLastname')}</dt>
              <dd>{juryPreview.lastname}</dd>
              {juryPreview.bio && (
                <>
                  <dt>{t('admin.juryBio')}</dt>
                  <dd className="admin-events-preview-desc">{juryPreview.bio}</dd>
                </>
              )}
            </dl>
            <button type="button" className="admin-profile-btn admin-profile-btn--primary" onClick={() => setPreviewId(null)}>
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {editingId && juryEditing && (
        <div className="admin-events-modal-overlay" onClick={() => setEditingId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-edit-jury-title">
          <div className="admin-events-modal admin-events-modal--form" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-edit-jury-title" className="admin-events-modal-title">{t('admin.editMemberTitle')}</h3>
            <form onSubmit={handleEditSubmit} className="admin-events-form">
              {formError && editingId && (
                <p className="admin-events-form-error" role="alert">
                  {formError}
                </p>
              )}
              <div className="admin-events-form-grid">
                <label className="admin-events-form-label">
                  {t('admin.juryFirstname')}
                  <input type="text" name="firstname" required className="admin-events-form-input" defaultValue={juryEditing.firstname} />
                </label>
                <label className="admin-events-form-label">
                  {t('admin.juryLastname')}
                  <input type="text" name="lastname" required className="admin-events-form-input" defaultValue={juryEditing.lastname} />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  {t('admin.juryBio')}
                  <textarea name="bio" rows={4} className="admin-events-form-input" defaultValue={juryEditing.bio || ''} placeholder={t('admin.juryBio')} />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  {t('admin.juryNewPhoto')}
                  <input type="file" name="illustration" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
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

export default AdminJury;
