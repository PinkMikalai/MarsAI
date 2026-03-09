import { useState, useEffect } from 'react';
import { assignmentService } from '../../service/assignmentService.js';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import Icons from '../../components/ui/common/Icons.jsx';


const AdminAssignment = ({ videos, isOpen, onClose, onSuccess, selectors }) => {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const [assigned, setAssigned] = useState([]);
    const [available, setAvailable] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAssignmentData = async () => {
            if (isOpen && videos && videos[0]?.id) {
                setLoading(true);
                try {
                    const response = await assignmentService.getAssignmentData(videos[0].id);
                    console.log('Data assignment', response);

                    if (response.success) {
                        setAvailable(response.data.selectors);
                        setAssigned(response.data.assigned);
                    }

                } catch (error) {
                    console.error('Assignment data error', error);

                } finally {
                    setLoading(false);
                }
            }
        }
        fetchAssignmentData();
    }, [isOpen, videos]);

    // assigner un selectionneur manuellement

    const handleAdd = (userId) => {
        const selector = available.find(user => user.id === parseInt(userId))
        if (selector) {
            setAssigned([...assigned, selector]);
            setAvailable(available.filter(user => user.id !== selector.id));
        }
    }
    // retirer un selectionneur d'une assignation manuellement 
    const handleRemove = (userToDelete) => {
        setAvailable([...available, userToDelete]);
        setAssigned(assigned.filter(user => (user.id || user.user_id) !== (userToDelete.id || userToDelete.user_id)));
    }
    // assignation automatique
    const handleAutoAssign = () => {
        const selectorsAutoAssigned = available.slice(0, 3);
        setAssigned([...assigned, ...selectorsAutoAssigned]);
        setAvailable(available.slice(3));
    }

    // 
    const handleConfirm = async () => {
        if (!videos || videos.length === 0) {
            return;
        }
        setLoading(true);

        try {
            await assignmentService.createAssignment({
                video_ids: [videos[0].id],
                user_ids: assigned.map(user => user.user_id || user.id),
                admin_id: user?.id
            })
            onSuccess(videos[0].id, assigned.length);
            onClose();

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }

    }

    return (
        <>
            <div
                className={`wf-admin-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            <div className={`wf-admin-panel ${isOpen ? 'wf-admin-panel--open' : ''}`}>
                <div className="wf-admin-panel-header">
                    <h3>Assignment : {videos?.[0]?.title || "Loading ..."}</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="wf-admin-panel-body">
                    {/* Btn assignation auto */}
                    <button className="admin-profile-btn--secondary w-full"
                        onClick={handleAutoAssign}>

                    </button>

                    {/* Liste des séléctionneurs */}
                    <div className="wf-admin-section">
                        <label>Add a selector</label>
                        <select
                            className="admin-main-search-input w-full"
                            onChange={(e) => handleAdd(e.target.value)}
                            value=""
                        >
                            <option value="" disabled>Choisir...</option>
                            {available.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.firstname} {u.lastname} ({u.current_load} films)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Equipe de selectionneurs pour un film  */}
                    <div className="wf-admin-section">
                        <h4> ({assigned.length})</h4>
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
                {/* Envoi dans le back pour traitement */}
                <div className="wf-admin-panel-footer">
                    <button
                        className="admin-profile-btn--primary w-full"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Confirm the assignment"}
                    </button>
                </div>
            </div>
        </>
    );

};

export default AdminAssignment;