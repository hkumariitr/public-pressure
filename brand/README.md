# Public Pressure — Brand foundation

Single source of brand truth, consumed by `web/` and `mobile/`.

| File | Use |
|---|---|
| `tokens.css` | CSS custom properties (web imports this) |
| `tokens.ts` | Typed tokens (mobile imports this) |
| `logo-on-ink.svg` | Primary mark on ink |
| `logo-on-white.svg` | Mark on white (प → ink) |
| `logo-reversed-red.svg` | Reversed on red (P → ink) |

## The rules that matter
- **Colour ratio:** ~60% ink/white, ~30% paper/grey, ~10% red. Red is for the
  **P**, **one** action per screen, and the **live** dot — nothing else.
- **Type:** Archivo (Latin), Hind (Devanagari, x‑height matched), JetBrains Mono
  (timestamps, sources, data).
- **The mark:** Devanagari प (public, neutral) + Latin P (pressure, red) share a
  stem. प is always the foreground neutral; P is always red except reversed on red.

> The SVG logos are glyph‑based reconstructions faithful to the brand sheet's
> colour, type and concept. Replace with the final vector artwork from design
> when available; keep the three‑variant structure and the colour rules.
