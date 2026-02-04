import React, { useState, useEffect } from 'react';
import TagInput from './TagInput';
import { tagsService } from '../../service/tags';

/**
 * Composant de filtre de tags pour la galerie
 * Affiche les top 10 tags populaires et permet de filtrer avec autocomplétion
 * 
 * @param {string[]} selectedTags - Tags actuellement sélectionnés pour le filtre
 * @param {function} onFilterChange - Callback appelé quand les tags de filtre changent (tags: string[]) => void
 */
function TagFilter({ selectedTags = [], onFilterChange }) {
  const [mostUsedTags, setMostUsedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les top 10 tags les plus utilisés
  useEffect(() => {
    const loadMostUsedTags = async () => {
      try {
        setLoading(true);
        const response = await tagsService.getMostUsedTags();
        // Prendre les 10 premiers tags
        const topTags = response.tags?.slice(0, 10).map(tag => tag.name.toLowerCase()) || [];
        setMostUsedTags(topTags);
      } catch (error) {
        console.error('Erreur lors du chargement des tags populaires:', error);
        setMostUsedTags([]);
      } finally {
        setLoading(false);
      }
    };

    loadMostUsedTags();
  }, []);

  const handleTagClick = (tag) => {
    // Toggle le tag (activer/désactiver)
    if (selectedTags.includes(tag)) {
      onFilterChange(selectedTags.filter(t => t !== tag));
    } else {
      onFilterChange([...selectedTags, tag]);
    }
  };

  const handleTagInputChange = (tags) => {
    // TagInput gère déjà les tags normalisés
    onFilterChange(tags);
  };

  return (
    <div className="galerie-tag-filter">
      <div className="galerie-tag-filter-header">
        <h3 className="galerie-tag-filter-title">Filtrer par tags</h3>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={() => onFilterChange([])}
            className="galerie-tag-filter-clear"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* TagInput avec autocomplétion */}
      <div className="galerie-tag-filter-input">
        <TagInput 
          tags={selectedTags} 
          onChange={handleTagInputChange}
        />
      </div>

      {/* Top 10 tags populaires */}
      {!loading && mostUsedTags.length > 0 && (
        <div className="galerie-tag-filter-popular">
          <p className="galerie-tag-filter-popular-label">Top 10 tags populaires :</p>
          <div className="galerie-tag-filter-popular-list">
            {mostUsedTags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`galerie-tag-filter-popular-tag ${isActive ? 'galerie-tag-filter-popular-tag--active' : ''}`}
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
}

export default TagFilter;
