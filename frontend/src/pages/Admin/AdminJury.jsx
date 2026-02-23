import { useEffect, useState } from 'react';
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
      setError(err.message || 'Erreur lors du chargement du jury.');
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
    const jury = jurys.find((j) => j.id === editingId);
    if (jury && !formData.get('illustration')?.name && jury.illustration) {
      formData.set('illustration', jury.illustration);
    }
    try {
      await juryService.update(editingId, formData);
      setEditingId(null);
      loadJurys();
    } catch (err) {
      setFormError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce membre du jury ?')) return;
    setDeletingId(id);
    try {
      await juryService.delete(id);
      setPreviewId(null);
      setEditingId(null);
      loadJurys();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression.');
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
          <p className="admin-overview-kicker">Gestion</p>
          <h2 className="admin-overview-title">Jury</h2>
          <p className="admin-overview-text">
            Liste des membres du jury. Aperçu, modification et suppression.
          </p>
        </div>
        <div className="admin-overview-header-actions">
          <button
            type="button"
            className="admin-profile-btn admin-profile-btn--primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Annuler' : 'Ajouter un membre'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-events-form-wrap">
          <h3 className="admin-events-form-title">Nouveau membre du jury</h3>
          <form onSubmit={handleCreateSubmit} className="admin-events-form">
            {formError && !editingId && (
              <p className="admin-events-form-error" role="alert">
                {formError}
              </p>
            )}
            <div className="admin-events-form-grid">
              <label className="admin-events-form-label">
                Prénom *
                <input type="text" name="firstname" required className="admin-events-form-input" placeholder="Jean" />
              </label>
              <label className="admin-events-form-label">
                Nom *
                <input type="text" name="lastname" required className="admin-events-form-input" placeholder="Dupont" />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                Bio
                <textarea name="bio" rows={4} className="admin-events-form-input" placeholder="Courte biographie du membre du jury" />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                Photo (illustration)
                <input type="file" name="illustration" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
              </label>
            </div>
            <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={submitting}>
              {submitting ? 'Création…' : 'Créer le membre'}
            </button>
          </form>
        </div>
      )}

      {loading && <p className="admin-profile-loading">Chargement du jury…</p>}
      {error && (
        <p className="admin-events-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="admin-events-list">
          {jurys.length === 0 ? (
            <p className="admin-events-empty">Aucun membre du jury pour le moment.</p>
          ) : (
            <div className="admin-events-table-wrap">
              <table className="admin-events-table">
                <thead>
                  <tr>
                    <th className="admin-events-th admin-events-th--img">Aperçu</th>
                    <th className="admin-events-th">Prénom</th>
                    <th className="admin-events-th">Nom</th>
                    <th className="admin-events-th">Bio</th>
                    <th className="admin-events-th admin-events-th--actions">Actions</th>
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
                        <button
                          type="button"
                          className="admin-events-btn admin-events-btn--preview"
                          onClick={() => setPreviewId(jury.id)}
                        >
                          Aperçu
                        </button>
                        <button
                          type="button"
                          className="admin-events-btn admin-events-btn--edit"
                          onClick={() => setEditingId(jury.id)}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="admin-events-btn admin-events-btn--delete"
                          onClick={() => handleDelete(jury.id)}
                          disabled={deletingId === jury.id}
                        >
                          {deletingId === jury.id ? '…' : 'Supprimer'}
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
      {previewId && juryPreview && (
        <div className="admin-events-modal-overlay" onClick={() => setPreviewId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-preview-jury-title">
          <div className="admin-events-modal admin-events-modal--preview" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-preview-jury-title" className="admin-events-modal-title">Aperçu du membre</h3>
            <div className="admin-events-preview-media">
              {juryPreview.illustration ? (
                <img src={getImageUrl(juryPreview.illustration)} alt="" className="admin-events-preview-img" />
              ) : (
                <div className="admin-events-preview-placeholder">Sans photo</div>
              )}
            </div>
            <dl className="admin-events-preview-dl">
              <dt>Prénom</dt>
              <dd>{juryPreview.firstname}</dd>
              <dt>Nom</dt>
              <dd>{juryPreview.lastname}</dd>
              {juryPreview.bio && (
                <>
                  <dt>Bio</dt>
                  <dd className="admin-events-preview-desc">{juryPreview.bio}</dd>
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
      {editingId && juryEditing && (
        <div className="admin-events-modal-overlay" onClick={() => setEditingId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-edit-jury-title">
          <div className="admin-events-modal admin-events-modal--form" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-edit-jury-title" className="admin-events-modal-title">Modifier le membre</h3>
            <form onSubmit={handleEditSubmit} className="admin-events-form">
              {formError && editingId && (
                <p className="admin-events-form-error" role="alert">
                  {formError}
                </p>
              )}
              <div className="admin-events-form-grid">
                <label className="admin-events-form-label">
                  Prénom *
                  <input type="text" name="firstname" required className="admin-events-form-input" defaultValue={juryEditing.firstname} />
                </label>
                <label className="admin-events-form-label">
                  Nom *
                  <input type="text" name="lastname" required className="admin-events-form-input" defaultValue={juryEditing.lastname} />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  Bio
                  <textarea name="bio" rows={4} className="admin-events-form-input" defaultValue={juryEditing.bio || ''} placeholder="Biographie" />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  Nouvelle photo (laisser vide pour conserver l&apos;actuelle)
                  <input type="file" name="illustration" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
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

export default AdminJury;
