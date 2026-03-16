import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import cmsService from '../../service/cmsService';

const COMPONENTS_OPTIONS = [
  { value: 'gallery',       label: 'Galerie de films' },
  { value: 'participation', label: 'Participation' },
  { value: 'learn_more',    label: 'En savoir plus' },
  { value: 'awards',        label: 'Palmarès / Gagnants' },
 
];

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateForInput = (d) => {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
};

const parseComponents = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
};

const EMPTY_FORM = {
  element: '',
  english_content: '',
  french_content: '',
  is_active: false,
  start_date: '',
  end_date: '',
  components: [],
};

const AdminCms = () => {
  const { user } = useAuth();
  const [phases,     setPhases    ] = useState([]);
  const [loading,    setLoading   ] = useState(true);
  const [error,      setError     ] = useState('');
  const [showForm,   setShowForm  ] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError,  setFormError ] = useState('');
  const [editingId,  setEditingId ] = useState(null);
  const [form,       setForm      ] = useState(EMPTY_FORM);

  const loadPhases = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await cmsService.getAllCms();
      setPhases(data.result ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPhases(); }, []);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleComponent = (val) => {
    setForm((prev) => {
      const list = prev.components.includes(val)
        ? prev.components.filter((c) => c !== val)
        : [...prev.components, val];
      return { ...prev, components: list };
    });
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (phase) => {
    setForm({
      element:         phase.element,
      english_content: phase.english_content || '',
      french_content:  phase.french_content  || '',
      is_active:       !!phase.is_active,
      start_date:      formatDateForInput(phase.start_date),
      end_date:        formatDateForInput(phase.end_date),
      components:      parseComponents(phase.components),
    });
    setEditingId(phase.id);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.element.trim()) return;
    setFormError('');
    setSubmitting(true);
    const payload = {
      element:         form.element.trim(),
      english_content: form.english_content,
      french_content:  form.french_content,
      is_active:       form.is_active ? 1 : 0,
      start_date:      form.start_date || null,
      end_date:        form.end_date   || null,
      components:      JSON.stringify(form.components),
    };
    try {
      if (editingId) {
        await cmsService.updateCms(editingId, payload);
      } else {
        await cmsService.createCms(payload);
      }
      closeForm();
      loadPhases();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (phase) => {
    try {
      await cmsService.updateCms(phase.id, {
        element:         phase.element,
        english_content: phase.english_content,
        french_content:  phase.french_content,
        illustration:    phase.illustration,
        start_date:      phase.start_date   || null,
        end_date:        phase.end_date     || null,
        components:      JSON.stringify(parseComponents(phase.components)),
        is_active:       phase.is_active ? 0 : 1,
      });
      loadPhases();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette phase ?')) return;
    try {
      await cmsService.deleteCms(id);
      loadPhases();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="admin-overview">

      {/* ── En-tête ── */}
      <div className="admin-overview-header">
        <div>
          <p className="admin-overview-kicker">CMS</p>
          <h2 className="admin-overview-title">Gestion des phases</h2>
          <p className="admin-overview-text">
            Créez et gérez les phases du festival, leur durée et les sections visibles au public.
          </p>
        </div>
        <div className="admin-overview-header-actions">
          <button
            type="button"
            className="admin-profile-btn admin-profile-btn--primary"
            onClick={showForm ? closeForm : openCreate}
          >
            {showForm ? 'Annuler' : '+ Nouvelle phase'}
          </button>
        </div>
      </div>

      {/* ── Formulaire création / édition ── */}
      {showForm && (
        <div className="admin-events-form-wrap">
          <h3 className="admin-events-form-title">
            {editingId ? 'Modifier la phase' : 'Nouvelle phase'}
          </h3>
          <form onSubmit={handleSubmit} className="admin-events-form">
            {formError && (
              <p className="admin-events-form-error" role="alert">{formError}</p>
            )}

            <div className="admin-events-form-grid">

              <label className="admin-events-form-label">
                Identifiant (slug unique)
                <input
                  type="text"
                  required
                  className="admin-events-form-input"
                  placeholder="ex: phase_participation"
                  value={form.element}
                  onChange={(e) => set('element', e.target.value)}
                  disabled={!!editingId}
                />
              </label>

              <label className="admin-events-form-label">
                Statut
                <select
                  className="admin-events-form-input"
                  value={form.is_active ? '1' : '0'}
                  onChange={(e) => set('is_active', e.target.value === '1')}
                >
                  <option value="0">Inactif</option>
                  <option value="1">Actif</option>
                </select>
              </label>

              <label className="admin-events-form-label">
                Date de début
                <input
                  type="date"
                  className="admin-events-form-input"
                  value={form.start_date}
                  onChange={(e) => set('start_date', e.target.value)}
                />
              </label>

              <label className="admin-events-form-label">
                Date de fin
                <input
                  type="date"
                  className="admin-events-form-input"
                  value={form.end_date}
                  onChange={(e) => set('end_date', e.target.value)}
                />
              </label>

              <label className="admin-events-form-label admin-events-form-label--full">
                Contenu anglais
                <textarea
                  rows={3}
                  className="admin-events-form-input"
                  placeholder="Description en anglais…"
                  value={form.english_content}
                  onChange={(e) => set('english_content', e.target.value)}
                />
              </label>

              <label className="admin-events-form-label admin-events-form-label--full">
                Contenu français
                <textarea
                  rows={3}
                  className="admin-events-form-input"
                  placeholder="Description en français…"
                  value={form.french_content}
                  onChange={(e) => set('french_content', e.target.value)}
                />
              </label>

              <div className="admin-events-form-label admin-events-form-label--full">
                <span>Sections visibles dans cette phase</span>
                <div className="admin-cms-components">
                  {COMPONENTS_OPTIONS.map((opt) => (
                    <label key={opt.value} className="admin-cms-checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.components.includes(opt.value)}
                        onChange={() => toggleComponent(opt.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

            </div>

            <div className="admin-events-modal-actions">
              <button
                type="button"
                className="admin-profile-btn admin-profile-btn--secondary"
                onClick={closeForm}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="admin-profile-btn admin-profile-btn--primary"
                disabled={submitting || !form.element.trim()}
              >
                {submitting ? 'Sauvegarde…' : editingId ? 'Enregistrer' : 'Créer la phase'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── États ── */}
      {loading && <p className="admin-profile-loading">Chargement des phases…</p>}
      {error   && <p className="admin-events-error" role="alert">{error}</p>}

      {/* ── Table ── */}
      {!loading && !error && (
        <div className="admin-events-list">
          {phases.length === 0 ? (
            <p className="admin-events-empty">Aucune phase créée.</p>
          ) : (
            <div className="admin-events-table-wrap">
              <table className="admin-events-table">
                <thead>
                  <tr>
                    <th className="admin-events-th">Phase</th>
                    <th className="admin-events-th">Statut</th>
                    <th className="admin-events-th">Période</th>
                    <th className="admin-events-th">Sections</th>
                    <th className="admin-events-th admin-events-th--actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {phases.map((phase) => {
                    const comps = parseComponents(phase.components);
                    return (
                      <tr key={phase.id} className="admin-events-tr">
                        <td className="admin-events-td admin-events-td--title">{phase.element}</td>

                        <td className="admin-events-td">
                          <span className={`admin-cms-badge admin-cms-badge--${phase.is_active ? 'active' : 'inactive'}`}>
                            {phase.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>

                        <td className="admin-events-td">
                          {formatDate(phase.start_date)} → {formatDate(phase.end_date)}
                        </td>

                        <td className="admin-events-td">
                          {comps.length > 0
                            ? comps.map((c) => COMPONENTS_OPTIONS.find((o) => o.value === c)?.label || c).join(', ')
                            : '—'}
                        </td>

                        <td className="admin-events-td admin-events-td--actions">
                          <button
                            type="button"
                            className="admin-events-btn admin-events-btn--edit"
                            onClick={() => openEdit(phase)}
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            className="admin-events-btn admin-events-btn--delete"
                            onClick={() => handleDelete(phase.id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminCms;
