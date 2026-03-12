import React, { useState, useEffect, useMemo } from 'react';
import { participationService } from '../../service/participationService.js';
import { useAuth } from '../../context/AuthContext';

const AdminParticipations = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const canManage = isAdmin || isSuperAdmin;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);
  const [search, setSearch] = useState('');

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await participationService.getAllParticipations();
        setVideos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des participations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(v =>
      (v.title_en || '').toLowerCase().includes(q) ||
      (v.title || '').toLowerCase().includes(q) ||
      (v.email || '').toLowerCase().includes(q)
    );
  }, [videos, search]);

  const handleDelete = async (video) => {
    if (!window.confirm(`Supprimer définitivement "${video.title_en}" ? Cette action est irréversible.`)) return;
    try {
      await participationService.deleteParticipation(video.id);
      setVideos(prev => prev.filter(v => v.id !== video.id));
      addToast(`Participation "${video.title_en}" supprimée`, 'success');
    } catch (err) {
      addToast(err.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const handleSendInvitation = async (video) => {
    try {
      await participationService.sendEditInvitation(video.id);
      addToast(`Invitation envoyée à ${video.email} pour le film "${video.title_en}"`, 'success');
    } catch (err) {
      addToast(err.message || "Erreur lors de l'envoi de l'invitation", 'error');
    }
  };

  return (
    <section className="admin-overview">
      {/* Toasts */}
      <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              background: toast.type === 'success' ? '#27ae60' : '#e74c3c',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              maxWidth: '360px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="admin-overview-header">
        <div>
          <p className="admin-overview-kicker">Administration</p>
          <h2 className="admin-overview-title">Participations</h2>
          <p className="admin-overview-text">
            Gérez les films soumis au festival et envoyez des invitations d'édition aux réalisateurs.
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par titre ou email…"
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '9px 14px',
            border: '1px solid #dde1e7',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
        {search && (
          <span style={{ marginLeft: '10px', fontSize: '13px', color: '#7f8c8d' }}>
            {filteredVideos.length} résultat{filteredVideos.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {error && (
        <div style={{ background: '#fdf0f0', border: '1px solid #e74c3c', borderRadius: '6px', padding: '1rem', marginBottom: '1.5rem', color: '#c0392b' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
          Chargement des participations…
        </div>
      ) : filteredVideos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
          {search ? 'Aucun résultat pour cette recherche.' : 'Aucune participation pour le moment.'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ecf0f1' }}>
                <th style={thStyle}>Titre (EN)</th>
                <th style={thStyle}>Réalisateur</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Pays</th>
                <th style={thStyle}>Classification</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((video, index) => (
                <tr key={video.id} style={{ borderBottom: '1px solid #ecf0f1', background: index % 2 === 0 ? 'white' : '#fafbfc' }}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: '600', color: '#2c3e50' }}>{video.title_en || '—'}</span>
                    {video.title && (
                      <span style={{ display: 'block', fontSize: '12px', color: '#7f8c8d' }}>{video.title}</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {video.realisator_firstname} {video.realisator_lastname}
                  </td>
                  <td style={tdStyle}>{video.email || '—'}</td>
                  <td style={tdStyle}>{video.country || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: video.classification === '100% AI' ? '#ebf5fb' : '#eafaf1',
                      color: video.classification === '100% AI' ? '#2980b9' : '#27ae60',
                    }}>
                      {video.classification || '—'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                      <button
                        onClick={() => handleSendInvitation(video)}
                        style={{
                          background: '#2980b9',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Envoyer invitation
                      </button>
                      {canManage && (
                        <button
                          onClick={() => handleDelete(video)}
                          style={{
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#2c3e50',
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '12px 16px',
  color: '#34495e',
  verticalAlign: 'middle',
};

export default AdminParticipations;
