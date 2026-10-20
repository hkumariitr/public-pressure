/* ============================================================================
   PUBLIC PRESSURE — BRAND TOKENS (v1), typed.
   Mirror of tokens.css for React Native / TS consumers.
   ============================================================================ */

export const color = {
  red:   '#E3122B', // Pressure Red — the P, CTAs, live
  ink:   '#141414', // primary dark, text, backgrounds
  white: '#FFFFFF', // प on dark, page surfaces
  paper: '#F3F2EF', // light backgrounds, cards
  slate: '#3D4F7C', // links, tags, charts
  grey:  '#6B6B6B', // meta text, timestamps, rules
  paperRule: '#E4E2DD',
  inkRule: 'rgba(20,20,20,0.10)',
} as const;

export const font = {
  latin: 'Archivo',
  deva:  'Hind',
  mono:  'JetBrainsMono',
} as const;

export const weight = {
  black: '800' as const,
  semi:  '600' as const,
  reg:   '400' as const,
};

export const type = {
  display: 40,
  h1: 30,
  h2: 24,
  h3: 20,
  body: 16,
  sm: 14,
  meta: 12,
} as const;

export const space = {
  x: 12,     // stem-width clear-space unit
  gap: 16,
  pad: 20,
  radius: 4,
  radiusLg: 10,
};

/** Ratio guide: ~60% ink/white, ~30% paper/grey, ~10% red. Red = the P, one
 *  action per screen, the live dot. Never let red compete with itself. */
export const ratio = { neutral: 0.6, secondary: 0.3, red: 0.1 };

export default { color, font, weight, type, space, ratio };
