import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FormCard from './FormCard';
import Icons from '../ui/common/Icons';
import TagInput from '../ui/tags/TagInput';
import { useDepositForm } from '../../context/DepositFormContext';
import { LANGUAGES_ISO6391, STILLS_MAX_COUNT } from '../../constants/submitForm';
import { tagsService } from '../../service/tags';

const UploadFilmStep = () => {
  const { t } = useTranslation();
  const { form, setFilm, setFile, setTags } = useDepositForm();
  const { film, files } = form;

  const videoRef     = useRef(null);
  const coverRef     = useRef(null);
  const subtitlesRef = useRef(null);
  const stillsRef    = useRef(null);

  const [coverPreview,    setCoverPreview]    = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [stillsPreviews,  setStillsPreviews]  = useState([]);
  const [mostUsedTags,    setMostUsedTags]    = useState([]);
  const [videoDragOver,   setVideoDragOver]   = useState(false);

  useEffect(() => {
    if (form.files.video instanceof File) {
      const url = URL.createObjectURL(form.files.video);
      setVideoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setVideoPreviewUrl(null);
  }, [form.files.video]);

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
    const urls = stills.map((f) => URL.createObjectURL(f));
    setStillsPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [form.files.stills]);

  useEffect(() => {
    tagsService.getMostUsedTags()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.tags || data?.data || []);
        setMostUsedTags(
          list.slice(0, 5)
            .map((tag) => (typeof tag === 'string' ? tag : tag?.name || '').toLowerCase())
            .filter(Boolean)
        );
      })
      .catch(() => setMostUsedTags([]));
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    setFile('video', file || null);
    e.target.value = '';
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setVideoDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && /video\/(mp4|quicktime|webm)/i.test(file.type)) setFile('video', file);
  };

  const handleVideoDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setVideoDragOver(true);
  };

  const handleVideoDragLeave = () => setVideoDragOver(false);

  const handleCoverChange     = (e) => setFile('cover',     e.target.files?.[0] || null);
  const handleSubtitlesChange = (e) => setFile('subtitles', e.target.files?.[0] || null);

  const handleStillsChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const current = form.files.stills || [];
    if (current.length >= STILLS_MAX_COUNT) return;
    setFile('stills', [...current, file]);
    e.target.value = '';
  };

  const handleRemoveStill = (index) => {
    setFile('stills', (form.files.stills || []).filter((_, i) => i !== index));
  };

  const handleAddPopularTag = (tag) => {
    const normalized = tag.toLowerCase().trim();
    const current = form.tags || [];
    if (!current.includes(normalized)) setTags([...current, normalized]);
  };

  return (
    <FormCard number="03" title={t('deposit.uploadTitle')}>
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
        <p className="deposit-info-box-text">{t('deposit.uploadInfo')}</p>
      </div>

      {/* TITRE + LANGUE */}
      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.filmTitle')}</label>
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
          <label className="deposit-field-label">{t('deposit.language')}</label>
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

      {/* TITRE EN + CLASSIFICATION */}
      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.filmTitleEn')}</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              placeholder="Neural Odyssey"
              value={film.title_en ?? ''}
              onChange={(e) => setFilm('title_en', e.target.value)}
            />
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.classification')}</label>
          <div className="deposit-field-wrap">
            <select
              className="deposit-input"
              value={film.classification ?? 'Hybrid'}
              onChange={(e) => setFilm('classification', e.target.value)}
            >
              <option value="Hybrid">Hybrid</option>
              <option value="100% AI">100% AI</option>
            </select>
          </div>
        </div>
      </div>

      {/* SYNOPSIS FR */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.synopsis')}</label>
        <div className="deposit-field-wrap">
          <textarea
            className="deposit-textarea deposit-textarea--short"
            placeholder="Une exploration de la créativité assistée par l'IA…"
            maxLength={300}
            value={film.description}
            onChange={(e) => setFilm('description', e.target.value)}
          />
        </div>
        <div className="deposit-char-count">{film.description.length} / 300</div>
      </div>

      {/* SYNOPSIS EN */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.synopsisEn')}</label>
        <div className="deposit-field-wrap">
          <textarea
            className="deposit-textarea deposit-textarea--short"
            placeholder="An exploration of AI-assisted creativity…"
            maxLength={300}
            value={film.synopsis_en ?? ''}
            onChange={(e) => setFilm('synopsis_en', e.target.value)}
          />
        </div>
        <div className="deposit-char-count">{(film.synopsis_en ?? '').length} / 300</div>
      </div>

      {/* RÉSUMÉ TECHNIQUE */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.techResume')}</label>
        <div className="deposit-field-wrap">
          <textarea
            className="deposit-textarea deposit-textarea--short"
            placeholder={t('deposit.techResumePlaceholder')}
            maxLength={500}
            value={film.tech_resume ?? ''}
            onChange={(e) => setFilm('tech_resume', e.target.value)}
          />
        </div>
        <div className="deposit-char-count">{(film.tech_resume ?? '').length} / 500</div>
      </div>

      {/* RÉSUMÉ CRÉATIF */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.creativeResume')}</label>
        <div className="deposit-field-wrap">
          <textarea
            className="deposit-textarea deposit-textarea--short"
            placeholder={t('deposit.creativeResumePlaceholder')}
            maxLength={500}
            value={film.creative_resume ?? ''}
            onChange={(e) => setFilm('creative_resume', e.target.value)}
          />
        </div>
        <div className="deposit-char-count">{(film.creative_resume ?? '').length} / 500</div>
      </div>

      {/* TAGS */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.tags')}</label>
        <TagInput tags={form.tags || []} onChange={setTags} />
        {mostUsedTags.length > 0 && (
          <div className="deposit-popular-tags">
            <p className="deposit-popular-tags-label">{t('deposit.popularTags')}</p>
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

      {/* VIDÉO */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.videoField')}</label>
        <div
          className={`deposit-upload-vignette deposit-upload-vignette--video ${videoPreviewUrl ? 'deposit-upload-vignette--preview' : ''} ${videoDragOver ? 'deposit-upload-vignette--drag-over' : ''}`}
          onClick={() => !videoPreviewUrl && videoRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && !videoPreviewUrl && videoRef.current?.click()}
          onDrop={handleVideoDrop}
          onDragOver={handleVideoDragOver}
          onDragLeave={handleVideoDragLeave}
          role="button"
          tabIndex={0}
          aria-label={videoPreviewUrl ? t('deposit.videoAriaChange') : t('deposit.videoAriaChoose')}
        >
          <input
            ref={videoRef}
            type="file"
            accept=".mp4,.mov,.webm"
            onChange={handleVideoChange}
            className="deposit-file-input-hidden"
          />
          {videoPreviewUrl ? (
            <>
              <video
                src={videoPreviewUrl}
                controls
                preload="metadata"
                className="deposit-video-player deposit-video-player--in-zone"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                className="deposit-upload-btn"
                onClick={(e) => { e.stopPropagation(); videoRef.current?.click(); }}
              >
                {t('deposit.changeVideo')}
              </button>
            </>
          ) : (
            <>
              <div className="deposit-upload-vignette-icon" aria-hidden><Icons.Upload /></div>
              <button
                type="button"
                className="deposit-upload-btn"
                onClick={(e) => { e.stopPropagation(); videoRef.current?.click(); }}
              >
                {t('deposit.chooseOrDropVideo')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* VIGNETTE + SOUS-TITRES */}
      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.coverField')}</label>
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
              <img src={coverPreview} alt={t('deposit.coverPreviewAlt')} className="deposit-upload-preview-img" />
            ) : (
              <div className="deposit-upload-vignette-icon" aria-hidden><Icons.Upload /></div>
            )}
            <button
              type="button"
              className="deposit-upload-btn"
              onClick={(e) => { e.stopPropagation(); coverRef.current?.click(); }}
            >
              {files.cover ? t('deposit.changeCover') : t('deposit.chooseCover')}
            </button>
          </div>
        </div>

        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.subtitlesField')}</label>
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
              {files.subtitles ? files.subtitles.name : t('deposit.chooseSubtitles')}
            </button>
          </div>
        </div>
      </div>

      {/* STILLS */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.stillsField')}</label>

        <div className="deposit-social-links">
          {stillsPreviews.map((previewUrl, i) => (
            <div key={i} className="deposit-social-link-row deposit-still-row">
              <img
                src={previewUrl}
                alt={`Still ${i + 1}`}
                className="deposit-still-thumb"
              />
              <span className="deposit-still-name">
                {(form.files.stills || [])[i]?.name || `Still ${i + 1}`}
              </span>
              <button
                type="button"
                className="deposit-social-link-remove"
                onClick={() => handleRemoveStill(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          ref={stillsRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleStillsChange}
          className="deposit-file-input-hidden"
        />
        <button
          type="button"
          className="deposit-social-link-add"
          disabled={(form.files.stills || []).length >= STILLS_MAX_COUNT}
          onClick={() => stillsRef.current?.click()}
        >
          + {t('deposit.chooseStills')} ({(form.files.stills || []).length} / {STILLS_MAX_COUNT})
        </button>
      </div>
    </FormCard>
  );
};

export default UploadFilmStep;
