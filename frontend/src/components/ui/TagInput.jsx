import React, { useState, useEffect, useRef } from 'react';
import { tagsService } from '../../service/tags';

/**
 * Composant pour gérer les tags (comme Instagram/TikTok)
 * Permet d'ajouter des tags en tapant et en appuyant sur Entrée
 * Compatible avec le système de tags du backend (normalisation: trim, lowercase)
 * Avec système d'autocomplétion basé sur les tags existants
 * 
 * @param {string[]} tags - Tableau des tags actuels
 * @param {function} onChange - Callback appelé quand les tags changent (tags: string[]) => void
 * @param {boolean} disabled - Désactive l'input si true
 */
function TagInput({ tags = [], onChange, disabled = false }) {
  // État pour l'input de tag
  const [inputValue, setInputValue] = useState('');
  // État pour les tags disponibles depuis le backend
  const [availableTags, setAvailableTags] = useState([]);
  // État pour les suggestions filtrées
  const [suggestions, setSuggestions] = useState([]);
  // État pour l'index de la suggestion sélectionnée (navigation clavier)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  // Référence pour le conteneur des suggestions
  const suggestionsRef = useRef(null);

  /**
   * Charge les tags disponibles depuis le backend au montage du composant
   */
  useEffect(() => {
    const loadAvailableTags = async () => {
      try {
        const response = await tagsService.getMostUsedTags();
        // Extraire les noms de tags depuis la réponse
        const tagNames = response.tags?.map(tag => tag.name.toLowerCase()) || [];
        setAvailableTags(tagNames);
      } catch (error) {
        console.error('Erreur lors du chargement des tags:', error);
        // En cas d'erreur, on continue sans autocomplétion
        setAvailableTags([]);
      }
    };

    if (!disabled) {
      loadAvailableTags();
    }
  }, [disabled]);

  /**
   * Filtre les suggestions en fonction de ce que l'utilisateur tape
   */
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
      return;
    }

    const normalizedInput = normalizeTag(inputValue);
    const filtered = availableTags
      .filter(tag => 
        tag.startsWith(normalizedInput) && // Commence par ce que l'utilisateur tape
        !tags.includes(tag) // N'est pas déjà dans les tags sélectionnés
      )
      .slice(0, 5); // Limiter à 5 suggestions

    setSuggestions(filtered);
    setSelectedSuggestionIndex(-1); // Réinitialiser la sélection
  }, [inputValue, availableTags, tags]);

  /**
   * Normalise un tag (trim, lowercase) - comme le backend
   */
  const normalizeTag = (tag) => {
    return tag.trim().toLowerCase();
  };

  /**
   * Ajoute un tag
   */
  const addTag = (tagToAdd) => {
    const newTag = normalizeTag(tagToAdd);
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
      setInputValue('');
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
  };

  /**
   * Gère les touches du clavier
   */
  const handleKeyDown = (e) => {
    // Si on a des suggestions et qu'on navigue avec les flèches
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        return;
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        return;
      }

      // Si on appuie sur Entrée avec une suggestion sélectionnée
      if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        addTag(suggestions[selectedSuggestionIndex]);
        return;
      }
    }

    // Si on appuie sur Entrée ou sur la virgule
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();

      // Si une suggestion est sélectionnée, l'utiliser
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        addTag(suggestions[selectedSuggestionIndex]);
      } else {
        // Sinon, utiliser ce qui est tapé
        addTag(inputValue);
      }
    }

    // Si on appuie sur Escape, fermer les suggestions
    if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }

    // Si on appuie sur Backspace et que l'input est vide, supprimer le dernier tag
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  /**
   * Sélectionne une suggestion au clic
   */
  const selectSuggestion = (suggestion) => {
    addTag(suggestion);
  };

  /**
   * Supprime un tag quand on clique sur le X
   */
  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="tag-input-wrapper" style={{ position: 'relative' }}>
      {/* Container pour les tags affichés */}
      <div className={`tag-input-container ${disabled ? 'disabled' : ''}`}>
        {/* Afficher les tags existants */}
        {tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="tag-remove-button"
                aria-label={`Supprimer le tag ${tag}`}
              >
                ×
              </button>
            )}
          </span>
        ))}

        {/* Input pour ajouter un nouveau tag */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            // Re-filtrer les suggestions quand on focus l'input
            if (inputValue.trim()) {
              const normalizedInput = normalizeTag(inputValue);
              const filtered = availableTags
                .filter(tag => 
                  tag.startsWith(normalizedInput) && 
                  !tags.includes(tag)
                )
                .slice(0, 5);
              setSuggestions(filtered);
            }
          }}
          onBlur={() => {
            // Fermer les suggestions après un court délai pour permettre le clic
            setTimeout(() => {
              setSuggestions([]);
              setSelectedSuggestionIndex(-1);
            }, 200);
          }}
          placeholder={tags.length === 0 ? 'Tapez un tag et appuyez sur Entrée' : ''}
          disabled={disabled}
          className="tag-input-field"
        />
      </div>

      {/* Liste des suggestions d'autocomplétion */}
      {suggestions.length > 0 && (
        <div className="tag-suggestions" ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className={`tag-suggestion-item ${
                index === selectedSuggestionIndex ? 'tag-suggestion-item--selected' : ''
              }`}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
            >
              <span className="tag-suggestion-text">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Indication pour l'utilisateur */}
      <p className="tag-input-hint">
        {suggestions.length > 0 
          ? 'Utilisez les flèches ↑↓ pour naviguer, Entrée pour sélectionner'
          : 'Appuyez sur Entrée ou tapez une virgule pour ajouter un tag'
        }
      </p>
    </div>
  );
}

export default TagInput;
