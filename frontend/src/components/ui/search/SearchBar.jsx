import React, { useState } from 'react';
import { searchService } from '../../../service/searchService';

const SearchBar = () => {
    const [search, setSearch] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await searchService.getSearchVideos({ search });
            setVideos(res?.data?.data ?? []);
        } catch (err) {
            setError('Erreur lors de la recherche.');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Rechercher"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? '...' : 'Rechercher'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {videos.length > 0 && (
                <ul>
                    {videos.map((video) => (
                        <li key={video.id}>{video.title}</li>
                    ))}
                </ul>
            )}

            {!loading && !error && videos.length === 0 && search && (
                <p>Aucun résultat pour &quot;{search}&quot;</p>
            )}
        </>
    );
};

export default SearchBar;
