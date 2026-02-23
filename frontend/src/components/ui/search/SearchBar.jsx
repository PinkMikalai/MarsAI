import searchService from '../../../service/searchService';
import React, { useRef, useState,useEffect } from 'react';



const SearchBar = ({ role, userId }) => {
    const [search, setSearch] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        searchService.searchVideos({ search, role, userId }).then((data) => {
            setVideos(data);
            setLoading(false);
            setError(null);
        }).catch((error) => {
            setError(error);
        });
    }
    return (
         <> 
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <button type="submit">
                    <Icons name="search" />
                </button>
            </form>
            {loading && <div>Chargement...</div>}
            {error && <div>Erreur: {error.message}</div>}
            {videos.length > 0 && <div>
                {videos.map((video) => (
                    <div key={video.id}>{video.title}</div>
                ))}
            </div>}
            {videos.length === 0 && <div>Aucun résultat trouvé</div>}
        </>
    )

}
export default SearchBar;
