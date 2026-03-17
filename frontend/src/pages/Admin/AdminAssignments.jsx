import { useState, useEffect } from 'react';
import { assignmentService } from '../../service/assignmentService.js';
import { useTranslation } from 'react-i18next';
import { videoApi } from '../../service/galleryService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminAssignment = ({ videos, admin_id, isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const [assigned, setAssigned] = useState([]);
    const [available, setAvailable] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initialisation
    useEffect(() => {
        const fetchSelectors = async () => {
            if (isOpen && videos?.length > 0) {
                setLoading(true);
                try {
                    const response = await assignmentService.getAssignmentData(videos[0].id);
                    if (response.success) {
                        setAvailable(response.data.selectors || []);
                        setAssigned(response.data.assigned || []);
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement des sélectionneurs', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSelectors();
    }, [isOpen, videos]);

    const handleAdd = (userId) => {
        const selector = available.find(u => u.id === parseInt(userId));
        if (selector) {
            setAssigned([...assigned, selector]);
            setAvailable(available.filter(u => u.id !== selector.id));
        }
    };

    const handleRemove = (userToDelete) => {
        setAvailable([...available, userToDelete]);
        setAssigned(assigned.filter(u => (u.id || u.user_id) !== (userToDelete.id || userToDelete.user_id)));
    };

 
    const handleAssignAll = () => {
        setAssigned([...assigned, ...available]);
        setAvailable([]);
    };

    //Auto-assignation 
  const handleSmartAutoAssign = async () => {
    setLoading(true);
    try {
      
        const allVideos = await videoApi.getAllVideos(); 
        const allVideoIds = allVideos.data.map(v => v.id);

        console.log("Assignation massive pour :", allVideoIds.length, "vidéos");

     
        await assignmentService.autoAssignment(allVideoIds, admin_id);
        
        onSuccess(); 
    } catch (error) {
        console.error("Erreur auto-assignation massive:", error);
    } finally {
        setLoading(false);
    }
};

    const handleConfirm = async () => {
        if (!videos || videos.length === 0) return;
        setLoading(true);

        try {
            await assignmentService.createAssignment({
                video_ids: videos.map(v => v.id),
                user_ids: assigned.map(u => u.user_id || u.id),
                admin_id: currentUser?.id
            });
            onSuccess(videos.map(v => v.id), assigned.length);
            onClose();
        } catch (error) {
            console.error('Erreur assignation masse', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="wf-admin-overlay active" onClick={onClose} />

            <div className="wf-admin-panel wf-admin-panel--open">
                <div className="wf-admin-panel-header">
                    <h3>
                        {videos?.length > 1 
                            ? `Assignation masse: ${videos.length} films` 
                            : `Assignation: ${videos?.[0]?.title}`
                        }
                    </h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="wf-admin-panel-body">
                    <div className="wf-admin-section flex flex-col gap-2">
                        {/* Bouton 1: Algorithme Backend */}
                        <button 
                            className="admin-profile-btn--primary w-full"
                            onClick={handleSmartAutoAssign}
                            disabled={loading}
                        >
                              {t('multi_assignments')}
                        </button>

                        {/* Bouton 2: Sélection visuelle de tous les noms */}
                        <button 
                            className="admin-profile-btn--secondary w-full"
                            onClick={handleAssignAll}
                        >
                            {t('assign_all_selectors')}
                        </button>
                        <p className="text-xs text-gray-500 italic">
                            * Fair assignments according to the current workload.
                        </p>
                    </div>

                    <hr className="my-4 border-gray-200" />

                    <div className="wf-admin-section">
                        <label>{t('add_selector')}</label>
                        <select
                            className="admin-main-search-input w-full"
                            onChange={(e) => handleAdd(e.target.value)}
                            value=""
                        >
                            <option value="" disabled>{t('choose')}</option>
                            {available.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.firstname} {u.lastname} ({u.current_load} films)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="wf-admin-section">
                        <h4>{t('team')} ({assigned.length})</h4>
                        <div className="admin-assigned-scroll">
                            {assigned.map(u => (
                                <div key={u.user_id || u.id} className="admin-card-pill">
                                    <span>{u.firstname} {u.lastname}</span>
                                    <span className="remove-pill" onClick={() => handleRemove(u)}>✕</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="wf-admin-panel-footer">
                    <button
                        className="admin-profile-btn--primary w-full"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? t('loading') : t('confirm_assignment')}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminAssignment;