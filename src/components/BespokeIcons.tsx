import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * BespokeUsers - High-end dual silhouette with an athletic guardian shield frame.
 * Representing parents, guardians, and support structure.
 */
export const BespokeUsers: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Dynamic Guardian Shield Arch */}
      <path d="M12 2a5.5 5.5 0 0 0-4.5 2.5C6.5 6 6 8.5 6 11c0 5 4 8.5 6 11 2-2.5 6-6 6-11 0-2.5-.5-5-1.5-6.5A5.5 5.5 0 0 0 12 2z" strokeWidth="1" strokeOpacity="0.18" />
      {/* Primary User (Guardian) */}
      <circle cx="12" cy="8" r="3" />
      <path d="M6 18c0-3 2.5-4.5 6-4.5s6 1.5 6 4.5" />
      {/* Secondary Companion (Child / Protected Player) */}
      <circle cx="8" cy="11" r="1.5" strokeWidth="1.5" strokeOpacity="0.75" />
      <path d="M4 17.5c0-1.5 1.5-2.25 4-2.25s4 .75 4 2.25" strokeWidth="1.5" strokeOpacity="0.75" />
    </svg>
  );
};

/**
 * BespokeUser - High-end athletic profile within a modern football crest geometry.
 * Representing the player, talent, and athlete.
 */
export const BespokeUser: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Elegant Team Badge/Crest Frame */}
      <path d="M5 3h14l1 7c0 6-4 10-8 11-4-1-8-5-8-11L5 3z" strokeWidth="1" strokeOpacity="0.2" />
      {/* Player silhouette */}
      <circle cx="12" cy="9.5" r="3.2" />
      {/* Clean Jersey Collar Shape */}
      <path d="M12 12.7v2" strokeWidth="1.2" strokeOpacity="0.6" />
      {/* Player shoulders */}
      <path d="M6.5 17.8c1-1.8 3-3 5.5-3s4.5 1.2 5.5 3" />
    </svg>
  );
};

/**
 * BespokeBarChart3 - A modern upward athletic progress chart.
 * Enclosed by stadium-lane track markings. Representing statistics and records.
 */
export const BespokeBarChart3: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Outer Stadium-Lane Oval Track boundary (highly premium feel) */}
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" strokeWidth="1" strokeOpacity="0.15" />
      
      {/* Rising progression pillars representing goals, assists, runtime */}
      <path d="M7 17V11" />
      <path d="M12 17V6" />
      <path d="M17 17V13" />
      
      {/* Dynamic progress arrow soaring upwards over the columns */}
      <path d="M14.5 5.5H18.5V9.5" strokeWidth="1.5" />
      <path d="M9 14.5L18 5.5" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
      
      {/* Ground baseline */}
      <path d="M5.5 18.5h13" strokeWidth="1.2" strokeOpacity="0.4" />
    </svg>
  );
};

/**
 * BespokeCreditCard - A payment card with secure micro-chip and soccer laurel markings.
 * Representing Academy tuition fees and financial processing.
 */
export const BespokeCreditCard: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Secure card frame */}
      <rect x="3" y="5" width="18" height="14" rx="3" />
      {/* Card Magnetic strip */}
      <path d="M3 10h18" strokeWidth="1.5" />
      {/* Premium secure chip icon */}
      <rect x="6" y="13" width="3" height="2.5" rx="0.5" strokeWidth="1" strokeOpacity="0.8" />
      {/* Dynamic Laurel-inspired verification security wave */}
      <path d="M14 14.5c.8-.5 1.5-.5 2 0s1.2.5 2 0" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );
};

/**
 * BespokeFileText - Stylized tactical sports handbook.
 * Representing camp essentials, rosters, and provisions list.
 */
export const BespokeFileText: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Tactical clipboard/handbook sheet */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      {/* Folded paper corner */}
      <path d="M14 2v6h6" />
      {/* List bullet lines mimicking a list of provisions */}
      <circle cx="8" cy="13" r="0.5" fill="currentColor" stroke="none" />
      <path d="M11 13h5" strokeWidth="1.5" />
      <circle cx="8" cy="17" r="0.5" fill="currentColor" stroke="none" />
      <path d="M11 17h5" strokeWidth="1.5" />
      {/* Mini strategic soccer/football pitch play vector in header */}
      <path d="M7 7.5c1.5 0 2.5 1 2.5 1s.8-2 2-2" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="1 1" />
    </svg>
  );
};

/**
 * BespokeLock - High-fidelity modern padlock.
 * Representing security, bank-transfer confidence, and privacy.
 */
export const BespokeLock: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Lock Shackle */}
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      {/* Lock Body */}
      <rect x="4" y="11" width="16" height="10" rx="2.5" />
      {/* Secure core ring */}
      <circle cx="12" cy="16" r="1.5" />
    </svg>
  );
};

/**
 * BespokeCopy - Double layered athletic sheets with clean alignment offsets.
 * Representing copy banking details action.
 */
export const BespokeCopy: React.FC<IconProps> = ({ size = 13, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Rear sheet */}
      <rect x="9" y="9" width="12" height="12" rx="2" />
      {/* Front sheet with offset */}
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
};

/**
 * BespokeUpload - Precision dynamic upward velocity vector through high-contrast boundary.
 * Representing upload proof-of-payment document.
 */
export const BespokeUpload: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Dynamic stadium boundary receiving line */}
      <path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
      {/* Uplink vector */}
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
};

/**
 * BespokeAlertCircle - Thin, elegant warning badge with clean alignment dot.
 * Representing form input alerts.
 */
export const BespokeAlertCircle: React.FC<IconProps> = ({ size = 10, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Clean outer warning outline */}
      <circle cx="12" cy="12" r="10" />
      {/* Elegant alert marker */}
      <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2.5" />
      {/* High-visibility alert dot */}
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
};

/**
 * BespokeCheck - High-precision sharp 45-degree angle checkmark.
 * Representing active states, completions, and checkbox confirmations.
 */
export const BespokeCheck: React.FC<IconProps> = ({ size = 12, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

/**
 * BespokeArrowRight - Sleek forward vector arrow with collegiate athletic tail accents.
 * Representing primary submission.
 */
export const BespokeArrowRight: React.FC<IconProps> = ({ size = 14, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Elite arrow line */}
      <line x1="4" y1="12" x2="20" y2="12" />
      {/* Forward arrowhead */}
      <polyline points="14 6 20 12 14 18" />
    </svg>
  );
};
