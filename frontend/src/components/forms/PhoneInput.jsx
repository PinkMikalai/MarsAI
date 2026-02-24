import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PHONE_PREFIX_OPTIONS } from '../../constants/submitForm';

const PhoneInput = ({ value, countryCode, onPhoneChange, onCountryChange, onBlur, placeholder = '612345678' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const searchTimeout = useRef(null);

  const config = PHONE_PREFIX_OPTIONS.find(o => o.value === countryCode);
  const prefix = config ? `+${config.prefix}` : '';

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.focus();
    }
  }, [open]);

  const getDisplayValue = () => {
    if (!value || !prefix) return value || '';
    return value.startsWith(prefix) ? value.slice(prefix.length) : value;
  };

  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (config && digits) {
      onPhoneChange(`+${config.prefix}${digits}`);
    } else {
      onPhoneChange(digits);
    }
  };

  const handleSelect = (opt) => {
    onCountryChange(opt.value);
    setOpen(false);
    setSearch('');
  };

  const scrollToMatch = useCallback((query) => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-country-name]');
    for (const item of items) {
      const name = item.getAttribute('data-country-name').toLowerCase();
      if (name.startsWith(query)) {
        item.scrollIntoView({ block: 'nearest' });
        item.classList.add('phone-input-option--highlight');
        setTimeout(() => item.classList.remove('phone-input-option--highlight'), 600);
        break;
      }
    }
  }, []);

  const handleKeyDown = (e) => {
    const char = e.key;
    if (char === 'Escape') {
      setOpen(false);
      setSearch('');
      return;
    }
    if (char.length === 1 && /[a-zA-Z]/.test(char)) {
      e.preventDefault();
      const newSearch = search + char.toLowerCase();
      setSearch(newSearch);
      clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => setSearch(''), 800);
      scrollToMatch(newSearch);
    }
  };

  return (
    <div className="phone-input" ref={wrapRef}>
      <button
        type="button"
        className="phone-input-prefix"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {countryCode && countryCode !== 'OTHER' && (
          <span className={`fi fi-${countryCode.toLowerCase()} phone-input-flag`} />
        )}
        <span className="phone-input-code">{prefix || '--'}</span>
        <span className="phone-input-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul
          ref={listRef}
          className="phone-input-dropdown"
          role="listbox"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {PHONE_PREFIX_OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={countryCode === opt.value}
              data-country-name={opt.name}
              className={`phone-input-option ${countryCode === opt.value ? 'phone-input-option--selected' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              <span className={`fi fi-${opt.flagClass} phone-input-flag`} />
              <span className="phone-input-option-prefix">+{opt.prefix}</span>
              <span className="phone-input-option-name">{opt.name}</span>
            </li>
          ))}
        </ul>
      )}

      <input
        type="tel"
        inputMode="numeric"
        className="deposit-input phone-input-field"
        placeholder={placeholder}
        value={getDisplayValue()}
        onChange={handleInputChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default PhoneInput;
