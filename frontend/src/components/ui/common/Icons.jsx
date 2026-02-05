// Icons , icônes factorisées pour le formulaire deposit ------------//
import {
  FiInfo,
  FiImage,
  FiLock,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiGlobe,
} from 'react-icons/fi';

const iconSize = 20;
const iconProps = { size: iconSize, strokeWidth: 2, 'aria-hidden': true };

// UploadSvg , icône upload avec brackets CSS ------------//
const UploadSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="deposit-icon-upload" aria-hidden>
    <path d="M24 2.2A2.21 2.21 0 0 0 21.8 0h-4.41a1.23 1.23 0 1 0 0 2.45h3.91a0.25 0.25 0 0 1 0.25 0.25v18.6a0.25 0.25 0 0 1 -0.25 0.25h-3.91a1.23 1.23 0 1 0 0 2.45h4.41a2.21 2.21 0 0 0 2.2 -2.2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <path d="M0 2.2v19.6A2.21 2.21 0 0 0 2.2 24h4.41a1.23 1.23 0 1 0 0 -2.45H2.7a0.25 0.25 0 0 1 -0.25 -0.25V2.7a0.25 0.25 0 0 1 0.25 -0.25h3.91a1.23 1.23 0 1 0 0 -2.45H2.2A2.21 2.21 0 0 0 0 2.2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <path d="M16.9 13a1 1 0 0 0 0.74 -1.62l-4.9 -5.64a1 1 0 0 0 -1.48 0l-4.9 5.64A1 1 0 0 0 7.1 13h3.18a0.25 0.25 0 0 1 0.25 0.25v5.49a1.47 1.47 0 0 0 2.94 0v-5.51a0.25 0.25 0 0 1 0.25 -0.25Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const Icons = {
  Info: () => <FiInfo {...iconProps} />,
  Image: () => <FiImage {...iconProps} />,
  Lock: () => <FiLock {...iconProps} />,
  ChevronDown: () => <FiChevronDown {...iconProps} />,
  ChevronUp: () => <FiChevronUp {...iconProps} />,
  ChevronLeft: () => <FiChevronLeft {...iconProps} />,
  ChevronRight: () => <FiChevronRight {...iconProps} />,
  Award: () => <FiAward {...iconProps} />,
  Trophy: () => <FiAward {...iconProps} />,
  Globe: () => <FiGlobe {...iconProps} />,
  Upload: UploadSvg,
};

export default Icons;
