import { useState } from 'react';
import type { NewsCard as Card } from '../types';

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function NewsCard({
  card, bookmarked, onBookmark, onVote,
}: {
  card: Card;
  bookmarked: boolean;
  onBookmark: (hashId: string) => void;
  onVote: (pollId: string, optionId: string) => void;
}) {
  const [voted, setVoted] = useState<string | null>(null);
  const hi = card.lang === 'hi';

  const share = async () => {
    const text = `${card.title} — Public Pressure`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Public Pressure', text, url: location.href }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard?.writeText(text);
    }
  };

  const poll = card.poll;
  const total = poll ? poll.options.reduce((n, o) => n + o.votes, 0) || 1 : 1;
  const leadId = poll ? [...poll.options].sort((a, b) => b.votes - a.votes)[0]?.id : null;

  return (
    <article className="pp-card" lang={card.lang}>
      {card.imageUrl && (
        <div
          className="pp-card-media"
          style={{ backgroundImage: `linear-gradient(135deg, var(--pp-ink-06), transparent)` }}
          aria-hidden="true"
        />
      )}
      <div className="pp-card-body">
        <div className="pp-eyebrow">
          {card.live && <span className="pp-live-dot" aria-hidden="true" />}
          {card.breaking && <span className="pp-breaking">{hi ? 'ताज़ा' : 'Breaking'}</span>}
          <span>{card.categories.join(' · ')}</span>
        </div>

        <h2 className="pp-card-title">{card.title}</h2>
        <p className="pp-card-text">{card.content}</p>

        {poll && (
          <div className="pp-poll" role="group" aria-label={poll.question}>
            <div className="pp-poll-q">{poll.question}</div>
            {poll.options.map((o) => {
              const pct = Math.round((o.votes / total) * 100);
              const done = voted !== null;
              return (
                <button
                  key={o.id}
                  className={`pp-poll-opt ${done && o.id === leadId ? 'pp-lead' : ''}`}
                  disabled={done}
                  onClick={() => { setVoted(o.id); onVote(poll.pollId, o.id); }}
                >
                  <span className="pp-poll-fill" style={{ width: done ? `${pct}%` : '0%' }} />
                  <span>{o.label}</span>
                  {done && <span className="pp-poll-pct">{pct}%</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="pp-card-source">
          <span>{card.sourceName}</span>
          <span>·</span>
          <span>{timeAgo(card.createdAt)}</span>
          <span>·</span>
          <span>{card.authorName}</span>
        </div>
      </div>

      <div className="pp-card-actions">
        <button
          className="pp-act"
          aria-pressed={bookmarked}
          onClick={() => onBookmark(card.hashId)}
        >
          {bookmarked ? '★' : '☆'} {hi ? 'सहेजें' : 'Save'}
        </button>
        <button className="pp-act" onClick={share}>↗ {hi ? 'साझा' : 'Share'}</button>
        <span className="pp-spacer" />
        {card.readMoreUrl && (
          <a className="pp-act" href={card.readMoreUrl} target="_blank" rel="noreferrer">
            {hi ? 'और पढ़ें' : 'Read more'}
          </a>
        )}
      </div>
    </article>
  );
}
