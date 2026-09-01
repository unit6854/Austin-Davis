import './Sheet.css';

/**
 * A sheet of paper for a piece of writing.
 *
 * The sheet takes its height from whatever is on it, so a short poem gets a
 * small page and a long letter gets a long one. Every piece gets its own
 * weathering: the `seed` is hashed into the position of the stains, the corner
 * wear and the tilt, so no two sheets are marked the same way — and the same
 * piece is marked identically every time it loads.
 */

function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** deterministic pseudo-random stream from the seed */
function stream(seed) {
  let state = hash(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

const round = (n, places = 2) => Number(n.toFixed(places));

function weathering(seed) {
  const next = stream(seed);
  const pick = (min, max) => round(min + next() * (max - min));

  /* five soft stains, spaced down the sheet so they never collide */
  const stain = (i) => {
    const size = pick(14, 30);
    return `radial-gradient(${size}rem ${round(size * pick(0.42, 0.76))}rem at ${pick(2, 98)}% ${round(4 + i * 20 + next() * 12)}%, rgba(148, 116, 72, ${pick(0.03, 0.075)}), transparent ${pick(64, 76)}%)`;
  };

  return {
    '--stains': [0, 1, 2, 3, 4].map(stain).join(', '),
    '--mottle-shift': `${pick(0, 100)}% ${pick(0, 100)}%`,
    '--fibre-shift': `${pick(0, 100)}% ${pick(0, 100)}%`,
    '--wear-tl': pick(0.05, 0.13),
    '--wear-tr': pick(0.04, 0.11),
    '--wear-bl': pick(0.06, 0.14),
    '--wear-br': pick(0.04, 0.12),
    '--tilt': `${pick(-0.24, 0.24)}deg`,
  };
}

export default function Sheet({ seed = 'sheet', children, className = '' }) {
  return (
    <div className={`sheet ${className}`.trim()} style={weathering(seed)}>
      <div className="sheet__surface" aria-hidden="true">
        <span className="sheet__mottle" />
        <span className="sheet__weave" />
        <span className="sheet__fibre" />
        <span className="sheet__wear" />
      </div>

      <div className="sheet__content">{children}</div>
    </div>
  );
}
