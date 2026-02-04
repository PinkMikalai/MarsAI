import React, { useRef, useState, useEffect } from 'react';
import FormCard from './FormCard';
import Icons from '../ui/Icons';
import TagInput from '../ui/TagInput';
import { useDepositForm } from '../../context/DepositFormContext';
import { LANGUAGES_ISO6391, STILLS_MAX_COUNT } from '../../constants/submitForm';
import { tagsService } from '../../service/tags';

const UploadFilmStep = () => {
  const { form, setFilm, setFile, setTags } = useDepositForm();
  const videoRef = useRef(null);
  const coverRef = useRef(null);
  const subtitlesRef = useRef(null);
  const stillsRef = useRef(null);

  const [coverPreview, setCoverPreview] = useState(null);
  const [stillsPreviews, setStillsPreviews] = useState([]);
  const [mostUsedTags, setMostUsedTags] = useState([]);

  useEffect(() => {
    if (form.files.cover) {
      const url = URL.createObjectURL(form.files.cover);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setCoverPreview(null);
  }, [form.files.cover]);

  useEffect(() => {
    const stills = form.files.stills || [];
    const urls = stills.map((file) => URL.createObjectURL(file));
    setStillsPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [form.files.stills]);

  // Charger les tags les plus utilisés
  useEffect(() => {
    const loadMostUsedTags = async () => {
      try {
        const response = await tagsService.getMostUsedTags();
        // Prendre les 5 premiers tags
        const topTags = response.tags?.slice(0, 5).map(tag => tag.name.toLowerCase()) || [];
        setMostUsedTags(topTags);
      } catch (error) {
        console.error('Erreur lors du chargement des tags populaires:', error);
        setMostUsedTags([]);
      }
    };

    loadMostUsedTags();
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    setFile('video', file || null);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    setFile('cover', file || null);
  };

  const handleSubtitlesChange = (e) => {
    const file = e.target.files?.[0];
    setFile('subtitles', file || null);
  };

  const handleStillsChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, STILLS_MAX_COUNT);
    setFile('stills', files);
  };

  // Ajouter un tag populaire aux tags sélectionnés
  const handleAddPopularTag = (tag) => {
    const currentTags = form.tags || [];
    // Normaliser le tag (lowercase, trim) pour correspondre au format de TagInput
    const normalizedTag = tag.toLowerCase().trim();
    // Vérifier si le tag n'est pas déjà présent
    if (!currentTags.includes(normalizedTag)) {
      setTags([...currentTags, normalizedTag]);
    }
  };

  const { film, files } = form;

  return (
    <FormCard number="03" title="Upload du film">
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
        <p className="deposit-info-box-text">
          Titre, descriptif et langue du film. Puis envoyez la vidéo, la vignette et éventuellement les sous-titres et les stills. On ne gère que le fichier (nom), pas de chemin.
        </p>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">Titre du film *</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              placeholder="Neural Odyssey"
              value={film.title}
              onChange={(e) => setFilm('title', e.target.value)}
            />
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label">Langue * (ISO 639-1)</label>
          <div className="deposit-field-wrap">
            <select
              className="deposit-input"
              value={film.language}
              onChange={(e) => setFilm('language', e.target.value)}
            >
              {LANGUAGES_ISO6391.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="deposit-field-group">
        <label className="deposit-field-label">Descriptif (max 500 car.)</label>
        <div className="deposit-field-wrap">
          <textarea
            className="deposit-textarea deposit-textarea--short"
            placeholder="Une exploration..."
            maxLength={500}
            value={film.description}
            onChange={(e) => setFilm('description', e.target.value)}
          />
        </div>
        <div className="deposit-char-count">{film.description.length} / 500</div>
      </div>

      <div className="deposit-field-group">
        <label className="deposit-field-label">Tags</label>
        <TagInput 
          tags={form.tags || []} 
          onChange={setTags}
        />
        
        {/* Tags les plus utilisés */}
        {mostUsedTags.length > 0 && (
          <div className="deposit-popular-tags">
            <p className="deposit-popular-tags-label">Tags populaires :</p>
            <div className="deposit-popular-tags-list">
              {mostUsedTags.map((tag) => {
                const isSelected = form.tags?.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddPopularTag(tag)}
                    disabled={isSelected}
                    className={`deposit-popular-tag ${isSelected ? 'deposit-popular-tag--selected' : ''}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="deposit-field-group">
        <label className="deposit-field-label">Durée (secondes, 30–120)</label>
        <div className="deposit-field-wrap">
          <input
            type="number"
            min={30}
            max={120}
            className="deposit-input"
            placeholder="58"
            value={film.duration}
            onChange={(e) => setFilm('duration', e.target.value ? parseInt(e.target.value, 10) : '')}
          />
        </div>
      </div>

      <div className="deposit-field-group">
        <label className="deposit-field-label">Vidéo * (mp4, mov, webm – max 300 Mo)</label>
        <div className="deposit-upload-vignette">
          <div className="deposit-upload-vignette-icon" aria-hidden><Icons.Upload /></div>
          <input
            ref={videoRef}
            type="file"
            accept=".mp4,.mov,.webm"
            onChange={handleVideoChange}
            className="deposit-file-input-hidden"
          />
          <button
            type="button"
            className="deposit-upload-btn"
            onClick={() => videoRef.current?.click()}
          >
            {files.video ? files.video.name : 'Choisir la vidéo'}
          </button>
        </div>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">Vignette (cover) * (jpg, png – max 5 Mo)</label>
          <div
            className="deposit-upload-vignette deposit-upload-vignette--preview"
            onClick={() => coverRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && coverRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={coverRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleCoverChange}
              className="deposit-file-input-hidden"
            />
            {coverPreview ? (
              <img src={coverPreview} alt="Aperçu vignette" className="deposit-upload-preview-img" />
            ) : (
              <div className="deposit-upload-vignette-icon" aria-hidden><Icons.Upload /></div>
            )}
            <button
              type="button"
              className="deposit-upload-btn"
              onClick={(e) => { e.stopPropagation(); coverRef.current?.click(); }}
            >
              {files.cover ? 'Changer la vignette' : 'Choisir la vignette'}
            </button>
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label">Sous-titres (srt – max 1 Mo)</label>
          <div className="deposit-upload-vignette">
            <div className="deposit-upload-vignette-icon" aria-hidden><Icons.Upload /></div>
            <input
              ref={subtitlesRef}
              type="file"
              accept=".srt"
              onChange={handleSubtitlesChange}
              className="deposit-file-input-hidden"
            />
            <button
              type="button"
              className="deposit-upload-btn"
              onClick={() => subtitlesRef.current?.click()}
            >
              {files.subtitles ? files.subtitles.name : 'Choisir un fichier .srt'}
            </button>
          </div>
        </div>
      </div>

      <div className="deposit-field-group">
        <label className="deposit-field-label">Stills (jpg, png – max 3, 5 Mo chacun)</label>
        <div className="deposit-upload-gallery">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="deposit-upload-gallery-item deposit-upload-gallery-item--preview"
              onClick={() => stillsRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && stillsRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              {stillsPreviews[i] ? (
                <img src={stillsPreviews[i]} alt={`Still ${i + 1}`} className="deposit-upload-preview-img deposit-upload-preview-img--still" />
              ) : (
                <span aria-hidden className="deposit-upload-gallery-placeholder"><Icons.Image /></span>
              )}
            </div>
          ))}
        </div>
        <input
          ref={stillsRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          onChange={handleStillsChange}
          className="deposit-file-input-hidden"
        />
        <button
          type="button"
          className="deposit-upload-btn deposit-upload-btn--stills"
          onClick={() => stillsRef.current?.click()}
        >
          Choisir les stills (0–3)
        </button>
      </div>
    </FormCard>
  );
};

export default UploadFilmStep;
