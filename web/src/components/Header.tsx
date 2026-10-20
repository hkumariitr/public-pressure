import { Lockup } from './Logo';
import type { Lang } from '../types';

export function Header({
  lang, onLang, view, onView, liveConnected,
}: {
  lang: Lang;
  onLang: (l: Lang) => void;
  view: 'feed' | 'search' | 'saved';
  onView: (v: 'feed' | 'search' | 'saved') => void;
  liveConnected: boolean;
}) {
  return (
    <header className="pp-header pp-on-ink">
      <button
        className="pp-iconbtn"
        aria-label="Home"
        onClick={() => onView('feed')}
        style={{ width: 'auto', padding: 0 }}
      >
        <Lockup />
      </button>
      <span className="pp-header-spacer" />

      <span
        className="pp-eyebrow"
        style={{ color: liveConnected ? 'var(--pp-white)' : 'var(--pp-grey)' }}
        title={liveConnected ? 'Live channel connected' : 'Live channel offline'}
      >
        {liveConnected && <span className="pp-live-dot" aria-hidden="true" />}
        LIVE
      </span>

      <div className="pp-langtoggle" role="group" aria-label="Language">
        <button aria-pressed={lang === 'en'} onClick={() => onLang('en')}>EN</button>
        <button aria-pressed={lang === 'hi'} onClick={() => onLang('hi')}>हिं</button>
      </div>

      <button
        className="pp-iconbtn"
        aria-label="Search"
        aria-pressed={view === 'search'}
        onClick={() => onView(view === 'search' ? 'feed' : 'search')}
      >⌕</button>
      <button
        className="pp-iconbtn"
        aria-label="Saved"
        aria-pressed={view === 'saved'}
        onClick={() => onView(view === 'saved' ? 'feed' : 'saved')}
      >★</button>
    </header>
  );
}
