import searchService from '../../../service/searchService';
import React, { useRef, useState,useEffect } from 'react';



const SearchBar = () => {
    const [search, setSearch] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);

    const handleSubmit = (e) => {
      
    }
    return (
         <> 
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <button type="submit">
                </button>
            </form>
           
        </>
    )

}
export default SearchBar;
