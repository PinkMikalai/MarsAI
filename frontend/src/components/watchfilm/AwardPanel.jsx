// =====================================================
// PANNEAU AWARDS — attribution de prix (admin seulement)
// =====================================================
const AwardPanel = ({ isOpen, onClose, allAwards, selectedIds, onToggle, onSave, saving, saved }) => (
    <div
        className={`wf-admin-panel wf-award-panel ${isOpen ? 'wf-admin-panel--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
    >
        <div className="wf-admin-panel-header">
            <h3 className="wf-admin-panel-title">🏆 Attribuer des prix</h3>
            <button className="wf-admin-panel-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="wf-admin-panel-body">
            {allAwards.length === 0 ? (
                <p className="wf-admin-text">Aucun prix disponible.</p>
            ) : (
                <ul className="wf-award-list">
                    {allAwards.map((award) => {
                        const checked = selectedIds.includes(award.id);
                        return (
                            <li key={award.id} className={`wf-award-item ${checked ? 'wf-award-item--selected' : ''}`}>
                                <label className="wf-award-label">
                                    <input
                                        type="checkbox"
                                        className="wf-award-checkbox"
                                        checked={checked}
                                        onChange={() => onToggle(award.id)}
                                    />
                                    <span className="wf-award-rank">#{award.award_rank ?? '—'}</span>
                                    <span className="wf-award-title">{award.title}</span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            )}

            <button
                className={`wf-award-save-btn ${saved ? 'wf-award-save-btn--saved' : ''}`}
                onClick={onSave}
                disabled={saving}
            >
                {saving ? 'Enregistrement…' : saved ? '✓ Enregistré !' : 'Enregistrer'}
            </button>
        </div>
    </div>
);

export { AwardPanel };
