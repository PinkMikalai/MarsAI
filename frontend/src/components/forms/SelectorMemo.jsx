import React, { useState, useEffect } from 'react';
import Icons from '../ui/common/Icons';
import { selectorService } from '../../service/selectorService';

// =====================================================
// HOOK : récupération des statuts depuis la BDD
// =====================================================

function useSelectionStatuses() {
    const [statuses, setStatuses] = useState([]);
    const [loadingStatuses, setLoadingStatuses] = useState(true);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await selectorService.getSelectionStatuses();
                setStatuses(response.statuses || []);
            } catch (err) {
                console.error("erreur chargement statuts:", err);
            } finally {
                setLoadingStatuses(false);
            }
        };
        fetchStatuses();
    }, []);
    

    return { statuses, loadingStatuses };
}

// =====================================================
// FORMULAIRE CRÉATION D'UN MEMO
// =====================================================

const CreateSelectorMemoForm = ({ videoId, onSuccess }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [selectionStatusId, setSelectionStatusId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { statuses, loadingStatuses } = useSelectionStatuses();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const memoData = {};
            if (rating !== '') memoData.rating = Number(rating);
            if (comment.trim() !== '') memoData.comment = comment.trim();
            if (selectionStatusId !== '') memoData.selection_status_id = Number(selectionStatusId);

            const response = await selectorService.createMemo(videoId, memoData);

            console.log("memo cree:", response);
            if (onSuccess) onSuccess(response.memo);

        } catch (err) {
            console.error("erreur createMemo:", err);
            setError(err.message || "Erreur lors de la création du memo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="deposit-form-zone selector-memo-form">

            {/* Header */}
            <div className="deposit-step-title">
                <span className="deposit-step-title-icon" aria-hidden />
                <h2 className="deposit-step-title-text">
                    <Icons.Award /> Noter cette vidéo
                </h2>
            </div>

            {/* Note */}
            <div className="deposit-field-group">
                <label htmlFor="rating" className="deposit-field-label">Note</label>
                <div className="deposit-field-wrap">
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="deposit-input"
                    >
                        <option value="">-- Choisir une note --</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n} / 10</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Statut de sélection */}
            <div className="deposit-field-group">
                <label htmlFor="selection_status_id" className="deposit-field-label">Statut</label>
                <div className="deposit-field-wrap">
                    <select
                        id="selection_status_id"
                        value={selectionStatusId}
                        onChange={(e) => setSelectionStatusId(e.target.value)}
                        className="deposit-input"
                        disabled={loadingStatuses}
                    >
                        <option value="">
                            {loadingStatuses ? "Chargement..." : "-- Choisir un statut --"}
                        </option>
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Commentaire */}
            <div className="deposit-field-group">
                <label htmlFor="comment" className="deposit-field-label">Commentaire</label>
                <div className="deposit-field-wrap">
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Votre commentaire sur cette vidéo..."
                        className="deposit-textarea deposit-textarea--short"
                        maxLength={2000}
                    />
                </div>
                <span className="deposit-char-count">{comment.length} / 2000</span>
            </div>

            {/* Erreur */}
            {error && (
                <div className="deposit-info-box">
                    <span className="deposit-info-box-icon"><Icons.Info /></span>
                    <p className="deposit-info-box-text">{error}</p>
                </div>
            )}

            {/* Bouton */}
            <div className="deposit-form-actions">
                <button
                    type="submit"
                    className="deposit-btn-submit"
                    disabled={loading || (!rating && !comment.trim() && !selectionStatusId)}
                >
                    {loading ? "Envoi en cours..." : "Envoyer ma note"}
                </button>
            </div>

        </form>
    );
};

// =====================================================
// FORMULAIRE MISE À JOUR D'UN MEMO
// =====================================================

const UpdateSelectorMemoForm = ({ memo, onSuccess }) => {
    const [rating, setRating] = useState(memo?.rating ?? '');
    const [comment, setComment] = useState(memo?.comment ?? '');
    const [selectionStatusId, setSelectionStatusId] = useState(memo?.selection_status_id ?? '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { statuses, loadingStatuses } = useSelectionStatuses();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const memoData = {};
            if (rating !== '') memoData.rating = Number(rating);
            if (comment.trim() !== '') memoData.comment = comment.trim();
            if (selectionStatusId !== '') memoData.selection_status_id = Number(selectionStatusId);

            const response = await selectorService.updateMemo(memo.id, memoData);

            console.log("memo mis a jour:", response);
            if (onSuccess) onSuccess(response.memo);

        } catch (err) {
            console.error("erreur updateMemo:", err);
            setError(err.message || "Erreur lors de la mise à jour du memo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="deposit-form-zone selector-memo-form">

            {/* Header */}
            <div className="deposit-step-title">
                <span className="deposit-step-title-icon" aria-hidden />
                <h2 className="deposit-step-title-text">
                    <Icons.Award /> Modifier ma note
                </h2>
            </div>

            {/* Note */}
            <div className="deposit-field-group">
                <label htmlFor="rating-update" className="deposit-field-label">Note</label>
                <div className="deposit-field-wrap">
                    <select
                        id="rating-update"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="deposit-input"
                    >
                        <option value="">-- Choisir une note --</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n} / 10</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Statut de sélection */}
            <div className="deposit-field-group">
                <label htmlFor="selection_status_id-update" className="deposit-field-label">Statut</label>
                <div className="deposit-field-wrap">
                    <select
                        id="selection_status_id-update"
                        value={selectionStatusId}
                        onChange={(e) => setSelectionStatusId(e.target.value)}
                        className="deposit-input"
                        disabled={loadingStatuses}
                    >
                        <option value="">
                            {loadingStatuses ? "Chargement..." : "-- Choisir un statut --"}
                        </option>
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Commentaire */}
            <div className="deposit-field-group">
                <label htmlFor="comment-update" className="deposit-field-label">Commentaire</label>
                <div className="deposit-field-wrap">
                    <textarea
                        id="comment-update"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Votre commentaire sur cette vidéo..."
                        className="deposit-textarea deposit-textarea--short"
                        maxLength={2000}
                    />
                </div>
                <span className="deposit-char-count">{comment.length} / 2000</span>
            </div>

            {/* Erreur */}
            {error && (
                <div className="deposit-info-box">
                    <span className="deposit-info-box-icon"><Icons.Info /></span>
                    <p className="deposit-info-box-text">{error}</p>
                </div>
            )}

            {/* Bouton */}
            <div className="deposit-form-actions">
                <button
                    type="submit"
                    className="deposit-btn-submit"
                    disabled={loading}
                >
                    {loading ? "Mise à jour..." : "Mettre à jour"}
                </button>
            </div>

        </form>
    );
};

export { CreateSelectorMemoForm, UpdateSelectorMemoForm };
