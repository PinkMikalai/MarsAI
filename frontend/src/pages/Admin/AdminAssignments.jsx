import { useState, useEffect } from 'react';
import { assignmentService } from '../../service/assignmentService.js';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx'


const AdminAssignment = ({ videos, isOpen, onClose, onSuccess, selectors }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [assigned, setAssigned] = useState([]);
    const [available, setAvailable] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectors) {
            setAvailable(selectors);
                setAssigned([])
        }
    }, [isOpen, selectors, videos]);

    const handleAdd = (id) => {
        const selector = available.find(user => user.id === parseInt(id))
        if (selector) {
            setAssigned([...assigned, selector]);
            setAvailable(available.filter(user => user.id !== selector.id))
        }
    }
    const handleConfirm = async () => {
        if(!currenVideo) {
            return;
        }
        setLoading(true);

        try {
            await assignmentService.createAssignment({
                video_ids: [currenVideo.id],
                user_ids: assigned.map(user => user.id),
                admin_id: user?.id
            })
            onSuccess(video.id, assigned.length);
            onClose();

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }

    }

    return (
        <>
            <div className={`wf-admin-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />

            <div className={`wf-admin-panel ${isOpen ? 'wf-admin-panel--open' : ''}`}>

                {/* Pour la version mobile */}
                <div className="mobile-drawer-handle" onClick={onClose}>
                    <span></span>
                </div>

                <div className="wf-admin-panel-header">
                    <div>
                        <h3 className="wf-admin-panel-title">Assignation Rapide</h3>
                        <span className="admin-film-target">{videos[0]?.title}</span>
                    </div>
                    <button className="wf-admin-panel-close" onClick={onClose}>✕</button>
                </div>

                <div className="wf-admin-panel-body">
                    <div className="wf-admin-section">
                        <button
                            className="admin-profile-btn admin-profile-btn--secondary w-full"
                            onClick={() => {
                                const toAdd = available.slice(0, 3);
                                setAssigned([...assigned, ...toAdd]);
                                setAvailable(available.slice(3));
                            }}
                        >
                            Les 3 plus disponibles
                        </button>
                    </div>

                    <div className="wf-admin-section">
                        <h4 className="wf-admin-section-title">Sélectionner</h4>
                        <select
                            className="admin-main-search-input w-full"
                            onChange={(e) => handleAdd(e.target.value)}
                            value=""
                        >
                            <option value="" disabled>Choisir un membre...</option>
                            {available.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.firstname} {user.lastname} ({user.current_load})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="wf-admin-section">
                        <h4 className="wf-admin-section-title">Équipe actuelle</h4>
                        <div className="admin-assigned-scroll">
                            {assigned.map(user => (
                                <div key={user.id} className="admin-card-pill">
                                    <span>{user.firstname} {user.lastname}</span>
                                    <span
                                        className="remove-pill"
                                        onClick={() => {
                                            setAvailable([...available, user]);
                                            setAssigned(assigned.filter(assigned => assigned.id !== user.id));
                                        }}
                                    >✕</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="wf-admin-panel-footer">
                    <button
                        className="admin-profile-btn admin-profile-btn--primary w-full"
                        disabled={assigned.length === 0 || loading}
                        onClick={handleConfirm}
                    >
                        {loading ? "Confirmation..." : "Confirmer l'équipe"}
                    </button>
                </div>
            </div>


        </>

    )

};

export default AdminAssignment;