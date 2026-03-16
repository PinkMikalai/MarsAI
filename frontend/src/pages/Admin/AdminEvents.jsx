import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../service/eventService';

const getImageUrl = (filename) => {
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
<<<<<<< HEAD
  const base = (import.meta.env.VITE_API_URL || '/api/marsai').replace(/\/marsai\/?$/, '');
=======
  const base = import.meta.env.VITE_API_URL.replace(/\/marsai\/?$/, '');
>>>>>>> 2437a5db3edb9f9c8da92c22b2884f150008991a
  return `${base}/assets/uploads/images/${filename}`;
};

const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateForInput = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toISOString().slice(0, 10);
};

const AdminEvents = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await eventService.getAll();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || t('admin.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    const form = e.target;
    const formData = new FormData(form);
    if (user?.id) formData.set('user_id', String(user.id));
    try {
      await eventService.create(formData);
      setShowForm(false);
      form.reset();
      loadEvents();
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
    if (user?.id) formData.set('user_id', String(user.id));
    const event = events.find((ev) => ev.id === editingId);
    if (event && !formData.get('illustration')?.name && event.illustration) {
      formData.set('illustration', event.illustration);
    }
    try {
      await eventService.update(editingId, formData);
      setEditingId(null);
      loadEvents();
    } catch (err) {
      setFormError(err.message || t('admin.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteEventConfirm'))) return;
    setDeletingId(id);
    try {
      await eventService.delete(id);
      setPreviewId(null);
      setEditingId(null);
      loadEvents();
    } catch (err) {
      setError(err.message || t('admin.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const eventPreview = previewId ? events.find((e) => e.id === previewId) : null;
  const eventEditing = editingId ? events.find((e) => e.id === editingId) : null;

  return (
    <section className="admin-overview">
      <div className="admin-overview-header">
        <div>
          <p className="admin-overview-kicker">{t('admin.kicker')}</p>
          <h2 className="admin-overview-title">{t('admin.eventsTitle')}</h2>
          <p className="admin-overview-text">
            {t('admin.eventsSubtitle')}
          </p>
        </div>
        <div className="admin-overview-header-actions">
          <button
            type="button"
            className="admin-profile-btn admin-profile-btn--primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? t('common.cancel') : t('admin.addEvent')}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-events-form-wrap">
          <h3 className="admin-events-form-title">{t('admin.newEventTitle')}</h3>
          <form onSubmit={handleCreateSubmit} className="admin-events-form">
            {formError && !editingId && (
              <p className="admin-events-form-error" role="alert">
                {formError}
              </p>
            )}
            <div className="admin-events-form-grid">
              <label className="admin-events-form-label">
                {t('admin.eventTitleField')}
                <input type="text" name="title" required className="admin-events-form-input" placeholder={t('admin.eventTitlePlaceholder')} />
              </label>
              <label className="admin-events-form-label">
                {t('admin.eventDateField')}
                <input type="date" name="date" required className="admin-events-form-input" />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                {t('admin.eventDescField')}
                <textarea name="description" rows={3} className="admin-events-form-input" placeholder={t('admin.eventDescPlaceholder')} />
              </label>
              <label className="admin-events-form-label">
                {t('admin.eventDuration')}
                <input type="number" name="duration" min={0} className="admin-events-form-input" placeholder="120" />
              </label>
              <label className="admin-events-form-label">
                {t('admin.eventCapacity')}
                <input type="number" name="capacity" min={0} className="admin-events-form-input" placeholder="100" />
              </label>
              <label className="admin-events-form-label">
                {t('admin.eventLocation')}
                <input type="text" name="location" className="admin-events-form-input" placeholder={t('admin.eventLocationPlaceholder')} />
              </label>
              <label className="admin-events-form-label admin-events-form-label--full">
                {t('admin.eventIllustration')}
                <input type="file" name="illustration" accept=".jpg,.jpeg,.png,.webp" className="admin-events-form-input" />
              </label>
            </div>
            <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={submitting}>
              {submitting ? t('admin.creating') : t('admin.createEvent')}
            </button>
          </form>
        </div>
      )}

      {loading && <p className="admin-profile-loading">{t('admin.loadingEvents')}</p>}
      {error && (
        <p className="admin-events-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="admin-events-list">
          {events.length === 0 ? (
            <p className="admin-events-empty">{t('admin.noEvents')}</p>
          ) : (
            <div className="admin-events-table-wrap">
              <table className="admin-events-table">
                <thead>
                  <tr>
                    <th className="admin-events-th admin-events-th--img">{t('admin.thPreview')}</th>
                    <th className="admin-events-th">{t('admin.thTitle')}</th>
                    <th className="admin-events-th">{t('admin.thDate')}</th>
                    <th className="admin-events-th">{t('admin.thLocation')}</th>
                    <th className="admin-events-th admin-events-th--actions">{t('admin.thActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="admin-events-tr">
                      <td className="admin-events-td admin-events-td--img">
                        <div className="admin-events-thumb">
                          {event.illustration ? (
                            <img src={getImageUrl(event.illustration)} alt="" className="admin-events-thumb-img" />
                          ) : (
                            <span className="admin-events-thumb-placeholder">—</span>
                          )}
                        </div>
                      </td>
                      <td className="admin-events-td admin-events-td--title">{event.title}</td>
                      <td className="admin-events-td">{formatDate(event.date)}</td>
                      <td className="admin-events-td">{event.location || '—'}</td>
                      <td className="admin-events-td admin-events-td--actions">
                        <button type="button" className="admin-events-btn admin-events-btn--preview" onClick={() => setPreviewId(event.id)}>
                          {t('admin.previewBtn')}
                        </button>
                        <button type="button" className="admin-events-btn admin-events-btn--edit" onClick={() => setEditingId(event.id)}>
                          {t('admin.editBtn')}
                        </button>
                        <button type="button" className="admin-events-btn admin-events-btn--delete" onClick={() => handleDelete(event.id)} disabled={deletingId === event.id}>
                          {deletingId === event.id ? t('admin.deletingBtn') : t('admin.deleteBtn')}
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

      {previewId && eventPreview && (
        <div className="admin-events-modal-overlay" onClick={() => setPreviewId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-preview-title">
          <div className="admin-events-modal admin-events-modal--preview" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-preview-title" className="admin-events-modal-title">{t('admin.previewEventTitle')}</h3>
            <div className="admin-events-preview-media">
              {eventPreview.illustration ? (
                <img src={getImageUrl(eventPreview.illustration)} alt="" className="admin-events-preview-img" />
              ) : (
                <div className="admin-events-preview-placeholder">{t('admin.noImage')}</div>
              )}
            </div>
            <dl className="admin-events-preview-dl">
              <dt>{t('admin.eventFieldTitle')}</dt>
              <dd>{eventPreview.title}</dd>
              <dt>{t('admin.eventFieldDate')}</dt>
              <dd>{formatDate(eventPreview.date)}</dd>
              {eventPreview.location && (
                <>
                  <dt>{t('admin.eventFieldLocation')}</dt>
                  <dd>{eventPreview.location}</dd>
                </>
              )}
              {eventPreview.duration != null && (
                <>
                  <dt>{t('admin.eventFieldDuration')}</dt>
                  <dd>{eventPreview.duration}</dd>
                </>
              )}
              {eventPreview.capacity != null && (
                <>
                  <dt>{t('admin.eventFieldCapacity')}</dt>
                  <dd>{eventPreview.capacity}</dd>
                </>
              )}
              {eventPreview.description && (
                <>
                  <dt>{t('admin.eventFieldDesc')}</dt>
                  <dd className="admin-events-preview-desc">{eventPreview.description}</dd>
                </>
              )}
            </dl>
            <button type="button" className="admin-profile-btn admin-profile-btn--primary" onClick={() => setPreviewId(null)}>
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {editingId && eventEditing && (
        <div className="admin-events-modal-overlay" onClick={() => setEditingId(null)} role="dialog" aria-modal="true" aria-labelledby="modal-edit-title">
          <div className="admin-events-modal admin-events-modal--form" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-edit-title" className="admin-events-modal-title">{t('admin.editEventTitle')}</h3>
            <form onSubmit={handleEditSubmit} className="admin-events-form">
              {formError && editingId && (
                <p className="admin-events-form-error" role="alert">
                  {formError}
                </p>
              )}
              <div className="admin-events-form-grid">
                <label className="admin-events-form-label">
                  {t('admin.eventTitleField')}
                  <input type="text" name="title" required className="admin-events-form-input" defaultValue={eventEditing.title} />
                </label>
                <label className="admin-events-form-label">
                  {t('admin.eventDateField')}
                  <input type="date" name="date" required className="admin-events-form-input" defaultValue={formatDateForInput(eventEditing.date)} />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  {t('admin.eventDescField')}
                  <textarea name="description" rows={3} className="admin-events-form-input" defaultValue={eventEditing.description || ''} placeholder={t('admin.eventDescField')} />
                </label>
                <label className="admin-events-form-label">
                  {t('admin.eventDuration')}
                  <input type="number" name="duration" min={0} className="admin-events-form-input" defaultValue={eventEditing.duration ?? ''} placeholder="120" />
                </label>
                <label className="admin-events-form-label">
                  {t('admin.eventCapacity')}
                  <input type="number" name="capacity" min={0} className="admin-events-form-input" defaultValue={eventEditing.capacity ?? ''} placeholder="100" />
                </label>
                <label className="admin-events-form-label">
                  {t('admin.eventLocation')}
                  <input type="text" name="location" className="admin-events-form-input" defaultValue={eventEditing.location || ''} placeholder={t('admin.eventLocationPlaceholder')} />
                </label>
                <label className="admin-events-form-label admin-events-form-label--full">
                  {t('admin.eventNewIllustration')}
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

export default AdminEvents;
