import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { assignmentService } from '../../service/assignmentService.js'
import { useAuth } from '../../context/AuthContext.jsx'


const AdminAssignment = ({ videos,isOpen, onClose, onSuccess, selectors }) => {
=======
import { assignmentService } from '../../service/assignmentService.js';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx'


const AdminAssignment = ({ videos, isOpen, onClose, onSuccess, selectors }) => {
    const { t } = useTranslation();
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
    const { user } = useAuth();
    const [assigned, setAssigned] = useState([]);
    const [available, setAvailable] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectors) {
<<<<<<< HEAD
            setAvailable(selectors),
=======
            setAvailable(selectors);
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
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
<<<<<<< HEAD
const handleConfirm = async () => {
    setLoading(true);

    try{
        await assignmentService.createAssignment({
            video_ids : [video.id],
            user_ids : assigned.map( user => user.id),
            admin_id: user?.id
        })
        onSuccess(video.id, assigned.length);
            onClose();

    }catch (error) {
        console.error(error);
    }finally{
        setLoading(false)
    }


}
 





=======
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

>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
    return (
        <>
            <div className={`wf-admin-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />

            <div className={`wf-admin-panel ${isOpen ? 'wf-admin-panel--open' : ''}`}>

<<<<<<< HEAD
                {/* BARRE DE PRÉHENSION MOBILE (Handle) */}
=======
                {/* Pour la version mobile */}
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
                <div className="mobile-drawer-handle" onClick={onClose}>
                    <span></span>
                </div>

                <div className="wf-admin-panel-header">
                    <div>
                        <h3 className="wf-admin-panel-title">Assignation Rapide</h3>
<<<<<<< HEAD
                        <span className="admin-film-target">{film?.title}</span>
=======
                        <span className="admin-film-target">{videos[0]?.title}</span>
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
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
<<<<<<< HEAD
                            ⚡ Les 3 plus disponibles
=======
                            Les 3 plus disponibles
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
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
<<<<<<< HEAD
                            {available.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.firstname} {u.lastname} ({u.current_load})
=======
                            {available.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.firstname} {user.lastname} ({user.current_load})
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="wf-admin-section">
                        <h4 className="wf-admin-section-title">Équipe actuelle</h4>
                        <div className="admin-assigned-scroll">
<<<<<<< HEAD
                            {assigned.map(u => (
                                <div key={u.id} className="admin-card-pill">
                                    <span>{u.firstname} {u.lastname}</span>
                                    <span
                                        className="remove-pill"
                                        onClick={() => {
                                            setAvailable([...available, u]);
                                            setAssigned(assigned.filter(a => a.id !== u.id));
=======
                            {assigned.map(user => (
                                <div key={user.id} className="admin-card-pill">
                                    <span>{user.firstname} {user.lastname}</span>
                                    <span
                                        className="remove-pill"
                                        onClick={() => {
                                            setAvailable([...available, user]);
                                            setAssigned(assigned.filter(assigned => assigned.id !== user.id));
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
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


<<<<<<< HEAD

        </>


    )


=======
        </>

    )

>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
};

export default AdminAssignment;