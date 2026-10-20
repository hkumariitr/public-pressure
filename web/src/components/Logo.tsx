/**
 * The पP mark: Devanagari प (public, neutral) + Latin P (pressure, red) on a
 * shared stem. Rendered from live glyphs so it scales crisply and inherits the
 * brand fonts. `surface` picks the neutral color per the brand variants.
 */
export function Logo({ height = 30, surface = 'ink' }: { height?: number; surface?: 'ink' | 'white' | 'red' }) {
  const neutral = surface === 'white' ? '#141414' : '#FFFFFF';
  const pColor = surface === 'red' ? '#141414' : '#E3122B';
  return (
    <svg
      height={height}
      viewBox="0 0 150 120"
      role="img"
      aria-label="Public Pressure"
      className="pp-logo"
    >
      <text
        x="30" y="92"
        fontFamily="Hind, Archivo, sans-serif" fontWeight={700}
        fontSize={104} fill={neutral} letterSpacing={-4}
      >प</text>
      <text
        x="78" y="92"
        fontFamily="Archivo, sans-serif" fontWeight={800}
        fontSize={104} fill={pColor} letterSpacing={-6}
      >P</text>
    </svg>
  );
}

/** Horizontal lockup used in the header: mark + wordmark + Hindi name. */
export function Lockup() {
  return (
    <div className="pp-logo-wrap">
      <Logo height={30} surface="ink" />
      <span className="pp-wordmark">
        Public<br />Pressure
        <span className="pp-hi">पब्लिक प्रेशर</span>
      </span>
    </div>
  );
}
