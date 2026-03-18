// =====================================================
// BOUTON ACTION — colonne droite du lecteur
// =====================================================
const ActionBtn = ({ icon, label, onClick, className = '' }) => (
    <button
        className={`wf-action-btn ${className}`}
        onClick={onClick}
        aria-label={label}
        title={label}
    >
        <span className="wf-action-btn-icon">{icon}</span>
        <span className="wf-action-btn-label">{label}</span>
    </button>
);

export { ActionBtn };
