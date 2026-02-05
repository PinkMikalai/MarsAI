// TagFilter , filtre de tags pour la galerie de films avec tags populaires ------------//
import React, { useState, useEffect } from 'react';
import { tagsService } from '../../../service/tags';
import TagInput from './TagInput';

const TagFilter = ({ selectedTags = [], onFilterChange }) => {
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    const loadPopularTags = async () => {
      try {
        const response = await tagsService.getMostUsedTags();
        // Prendre les 10 premiers tags les plus utilisés
        const topTags = response.tags?.slice(0, 10).map(tag => tag.name.toLowerCase()) || [];
        setPopularTags(topTags);
      } catch (error) {
        console.error('Erreur lors du chargement des tags populaires:', error);
        setPopularTags([]);
      }
    };

    loadPopularTags();
  }, []);

  const handleTagChange = (newTags) => {
    onFilterChange(newTags);
  };

  const handlePopularTagClick = (tag) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (!selectedTags.includes(normalizedTag)) {
      handleTagChange([...selectedTags, normalizedTag]);
    } else {
      // Si déjà sélectionné, le retirer
      handleTagChange(selectedTags.filter(t => t !== normalizedTag));
    }
  };

  const handleClear = () => {
    handleTagChange([]);
  };

  return (
    <div className="galerie-tag-filter">
      <div className="galerie-tag-filter-header">
        <h3 className="galerie-tag-filter-title">Filtrer par tags</h3>
        {selectedTags.length > 0 && (
          <button
            type="button"
            className="galerie-tag-filter-clear"
            onClick={handleClear}
          >
            Effacer
          </button>
        )}
      </div>

      <div className="galerie-tag-filter-input">
        <TagInput tags={selectedTags} onChange={handleTagChange} />
      </div>

      {popularTags.length > 0 && (
        <div className="galerie-tag-filter-popular">
          <p className="galerie-tag-filter-popular-label">Tags populaires :</p>
          <div className="galerie-tag-filter-popular-list">
            {popularTags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`galerie-tag-filter-popular-tag ${isActive ? 'galerie-tag-filter-popular-tag--active' : ''}`}
                  onClick={() => handlePopularTagClick(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
