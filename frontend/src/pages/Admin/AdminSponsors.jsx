import { useEffect, useState } from 'react';
import { sponsorService } from '../../service/sponsorService';

const getImageUrl = (filename) => {
  if (!filename) return null;
  return sponsorService.getSponsorImageUrl(filename);
};

const AdminSponsors = () => {
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
      setError(err.message || 'Erreur lors du chargement des sponsors.');
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
      setFormError(err.message || 'Erreur lors de la création.');
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
      setFormError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce sponsor ?')) return;
    setDeletingId(id);
    try {
      await sponsorService.delete(id);
      setPreviewId(null);
      setEditingId(null);
      loadSponsors();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression.');
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
          <p className="admin-overview-kicker">Gestion</p>
          <h2 className="admin-overview-title">Sponsors</h2>
          <p className="admin-overview-text">
            Liste des partenaires affichés sur la home. Aperçu, modification et suppression.
          </p>
        </div>
        <div className="admin-overview-header-actions">
          <button
            type="button"
            className="admin-profile-btn admin-profile-btn--primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Annuler' : 'Ajouter un sponsor'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-events-form-wrap">
          <h3 className="admin-events-form-title">Nouveau sponsor</h3>
          <form onSubmit={handleCreateSubmit} className="admin-events-form">
            {formError && !editingId && (
              <p className="admin-events-form-error" role="alert">
                {formError}
              </p>
            )}
            <div className="admin-events-form-grid">
              <label className="admin-events-form-label admin-events-form-label--full">
                Nom *
                <input type="text" name="name" required className="admin-events-form-input" placeholder="Ex. NVIDIA" />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                URL (site du partenaire)
                <input type="url" name="url" className="admin-events-form-input" placeholder="https://..." />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                Logo (image)
                <input type="file" name="img" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
              </label>
            </div>
            <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={submitting}>
              {submitting ? 'Création…' : 'Créer le sponsor'}
            </button>
          </form>
        </div>
      )}

      {loading && <p className="admin-profile-loading">Chargement des sponsors…</p>}
      {error && (
        <p className="admin-events-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="admin-events-list">
          {sponsors.length === 0 ? (
            <p className="admin-events-empty">Aucun sponsor pour le moment.</p>
          ) : (
            <div className="admin-events-table-wrap">
              <table className="admin-events-table">
                <thead>
                  <tr>
                    <th className="admin-events-th admin-events-th--img">Aperçu</th>
                    <th className="admin-events-th">Nom</th>
                    <th className="admin-events-th">URL</th>
                    <th className="admin-events-th admin-events-th--actions">Actions</th>
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
                        <button
                          type="button"
                          className="admin-events-btn admin-events-btn--preview"
                          onClick={() => setPreviewId(sponsor.id)}
                        >
                          Aperçu
                        </button>
                        <button
                          type="button"
                          className="admin-events-btn admin-events-btn--edit"
                          onClick={() => setEditingId(sponsor.id)}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="admin-events-btn admin-events-btn--delete"
                          onClick={() => handleDelete(sponsor.id)}
                          disabled={deletingId === sponsor.id}
                        >
                          {deletingId === sponsor.id ? '…' : 'Supprimer'}
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

      {/* Modal Aperçu */}
      {previewId && sponsorPreview && (
        <div className="admin-events-modal-overlay" onClick={() => setPreviewId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-preview-sponsor-title">
          <div className="admin-events-modal admin-events-modal--preview" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-preview-sponsor-title" className="admin-events-modal-title">Aperçu du sponsor</h3>
            <div className="admin-events-preview-media">
              {sponsorPreview.img ? (
                <img src={getImageUrl(sponsorPreview.img)} alt="" className="admin-events-preview-img" />
              ) : (
                <div className="admin-events-preview-placeholder">Sans logo</div>
              )}
            </div>
            <dl className="admin-events-preview-dl">
              <dt>Nom</dt>
              <dd>{sponsorPreview.name}</dd>
              {sponsorPreview.url && (
                <>
                  <dt>URL</dt>
                  <dd>
                    <a href={sponsorPreview.url} target="_blank" rel="noopener noreferrer" className="admin-events-link">{sponsorPreview.url}</a>
                  </dd>
                </>
              )}
            </dl>
            <button type="button" className="admin-profile-btn admin-profile-btn--primary" onClick={() => setPreviewId(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {editingId && sponsorEditing && (
        <div className="admin-events-modal-overlay" onClick={() => setEditingId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-edit-sponsor-title">
          <div className="admin-events-modal admin-events-modal--form" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-edit-sponsor-title" className="admin-events-modal-title">Modifier le sponsor</h3>
            <form onSubmit={handleEditSubmit} className="admin-events-form">
              {formError && editingId && (
                <p className="admin-events-form-error" role="alert">
                  {formError}
                </p>
              )}
              <div className="admin-events-form-grid">
                <label className="admin-events-form-label admin-events-form-label--full">
                  Nom *
                  <input type="text" name="name" required className="admin-events-form-input" defaultValue={sponsorEditing.name} />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  URL (site du partenaire)
                  <input type="url" name="url" className="admin-events-form-input" defaultValue={sponsorEditing.url || ''} placeholder="https://..." />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  Nouveau logo (laisser vide pour conserver l&apos;actuel)
                  <input type="file" name="img" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
                </label>
              </div>
              <div className="admin-events-modal-actions">
                <button type="button" className="admin-profile-btn admin-profile-btn--secondary" onClick={() => setEditingId(null)}>
                  Annuler
                </button>
                <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={submitting}>
                  {submitting ? 'Enregistrement…' : 'Enregistrer'}
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
