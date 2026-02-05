// TagInput , composant de saisie de tags avec autocomplétion ------------//
import React, { useState, useRef, useEffect } from 'react';
import { tagsService } from '../../../service/tags';

const TagInput = ({ tags = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Charger les suggestions depuis l'API
  useEffect(() => {
    const loadSuggestions = async () => {
      if (inputValue.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await tagsService.getMostUsedTags();
        const allTags = response.tags?.map(t => t.name.toLowerCase()) || [];
        
        // Filtrer les suggestions basées sur l'input
        const filtered = allTags.filter(tag => 
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(tag.toLowerCase())
        );
        
        setSuggestions(filtered.slice(0, 10));
        setShowSuggestions(filtered.length > 0);
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, tags]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const addTag = (tag) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      onChange([...tags, normalizedTag]);
      setInputValue('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="tag-input-wrapper">
      <div className="tag-input-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag-badge">
            {tag}
            <button
              type="button"
              className="tag-remove-button"
              onClick={() => removeTag(tag)}
              aria-label={`Supprimer le tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="tag-input-field"
          placeholder={tags.length === 0 ? "Ajouter des tags..." : ""}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => inputValue.trim().length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="tag-suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className={`tag-suggestion-item ${index === selectedIndex ? 'tag-suggestion-item--selected' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="tag-suggestion-text">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
      
      <p className="tag-input-hint">
        Appuyez sur Entrée pour ajouter un tag. Utilisez les flèches pour naviguer dans les suggestions.
      </p>
    </div>
  );
};

export default TagInput;
