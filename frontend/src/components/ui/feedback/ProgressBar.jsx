import React from 'react';

const VARIANT_STYLES = {
  dark: { bar: 'bg-dark', text: 'text-heading' },
  brand: { bar: 'bg-brand', text: 'text-fg-brand' },
  success: { bar: 'bg-success', text: 'text-fg-success' },
};

const ProgressBar = ({
  label = 'Chargement…',
  value = 45,
  variant = 'brand',
  className = '',
  labelClassName = '',
}) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.brand;
  const labelClass = labelClassName || styles.text || 'text-white/70';

  return (
    <div className={`flex flex-col gap-2 ${className}`} role="status" aria-live="polite">
      {label ? <div className={`mb-1 text-sm font-medium ${labelClass}`}>{label}</div> : null}
      <div className="w-full bg-neutral-quaternary rounded-full h-2">
        <div
          className={`${styles.bar} h-2 rounded-full transition-[width] duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;