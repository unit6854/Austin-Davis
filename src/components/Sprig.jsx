/**
 * A pressed botanical sprig, drawn rather than photographed so it stays crisp
 * at any size and costs nothing to load.
 *
 * The geometry is grown from the stem: branches leave it along its tangent,
 * taper toward the tip, and each flower is turned to face the way its branch
 * grew. A fixed jitter table keeps it irregular without being random.
 */

const STEM = [
  [60, 398],
  [92, 296],
  [140, 176],
  [178, 22],
];

/* deterministic irregularity — the same every render, natural to the eye */
const JITTER = [
  0.62, -0.41, 0.88, -0.72, 0.24, -0.93, 0.51, -0.28,
  0.79, -0.58, 0.17, -0.84, 0.68, -0.46, 0.36, -0.21,
];

const RAD = Math.PI / 180;

function cubic([a, b, c, d], t) {
  const u = 1 - t;
  return [
    u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
    u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1],
  ];
}

function tangent([a, b, c, d], t) {
  const u = 1 - t;
  const x = 3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]);
  const y = 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1]);
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
}

function rotate([x, y], deg) {
  const a = deg * RAD;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
}

function buildBranches() {
  const branches = [];

  for (let i = 0; i < 13; i += 1) {
    const t = 0.06 + (i / 12) * 0.86;          // 0.06 (top) → 0.92 (base)
    const j = JITTER[i % JITTER.length];
    const side = i % 2 === 0 ? 1 : -1;

    const base = cubic(STEM, t);
    const dir = tangent(STEM, t);

    const spread = (58 + j * 16) * side;
    const length = 26 + 74 * t ** 0.9;

    const out = rotate(dir, spread);
    const bend = rotate(dir, spread * 0.52);

    const tip = [base[0] + out[0] * length, base[1] + out[1] * length];
    const ctrl = [
      base[0] + bend[0] * length * 0.62,
      base[1] + bend[1] * length * 0.62,
    ];

    branches.push({ base, ctrl, tip, kind: i % 5 === 0 ? 'bud' : 'flower' });

    /* a shorter branch leaving the first, so the blossom clusters */
    if (i > 1) {
      const mid = [
        base[0] + (tip[0] - base[0]) * 0.52,
        base[1] + (tip[1] - base[1]) * 0.52,
      ];
      const subDir = rotate(out, -side * (30 + JITTER[(i + 5) % JITTER.length] * 18));
      const subLen = length * (0.44 + Math.abs(j) * 0.2);
      const subTip = [mid[0] + subDir[0] * subLen, mid[1] + subDir[1] * subLen];
      const subCtrl = [
        mid[0] + rotate(out, -side * 12)[0] * subLen * 0.6,
        mid[1] + rotate(out, -side * 12)[1] * subLen * 0.6,
      ];

      branches.push({
        base: mid,
        ctrl: subCtrl,
        tip: subTip,
        kind: i % 3 === 0 ? 'bud' : 'flower',
      });
    }
  }

  return branches;
}

const BRANCHES = buildBranches();

const LEAVES = [0.9, 0.78, 0.66, 0.54, 0.42, 0.3].map((t, i) => {
  const p = cubic(STEM, t);
  const dir = tangent(STEM, t);
  const side = i % 2 === 0 ? -1 : 1;
  const out = rotate(dir, 74 * side);
  return {
    x: p[0],
    y: p[1],
    r: (Math.atan2(out[1], out[0]) * 180) / Math.PI,
    s: 1.05 - i * 0.08,
  };
});

const facing = (ctrl, tip) =>
  (Math.atan2(tip[1] - ctrl[1], tip[0] - ctrl[0]) * 180) / Math.PI + 90;

const n = (v) => Math.round(v * 10) / 10;

export default function Sprig({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* five petals opening away from the branch */}
        <g id="sprig-flower">
          {[-74, -37, 0, 37, 74].map((a) => (
            <path
              key={a}
              d="M0 0C-2.4-4.4-2.4-9.6 0-12.1 2.4-9.6 2.4-4.4 0 0Z"
              transform={`rotate(${a})`}
            />
          ))}
          <path d="M0 0v-3.2" />
        </g>

        {/* a closed bud */}
        <g id="sprig-bud">
          <path d="M0 0C-2.1-3.2-2.5-7-1-9.2 1.1-7.6 2.3-3.8 0 0Z" />
          <path d="M0 0C2.1-3.2 2.5-7 1-9.2-1.1-7.6-2.3-3.8 0 0Z" />
        </g>

        <g id="sprig-leaf">
          <path d="M0 0C5.2-5.6 12.8-8.1 19.2-6.5 17.3-.2 10 3.7 0 0Z" />
          <path d="M0 0C6-1.9 12.3-3.9 18-5.4" />
        </g>
      </defs>

      <path
        d={`M${STEM[0][0]} ${STEM[0][1]}C${STEM[1][0]} ${STEM[1][1]} ${STEM[2][0]} ${STEM[2][1]} ${STEM[3][0]} ${STEM[3][1]}`}
      />

      {BRANCHES.map((b, i) => (
        <path
          key={`b${i}`}
          d={`M${n(b.base[0])} ${n(b.base[1])}Q${n(b.ctrl[0])} ${n(b.ctrl[1])} ${n(b.tip[0])} ${n(b.tip[1])}`}
        />
      ))}

      {BRANCHES.map((b, i) => (
        <use
          key={`t${i}`}
          href={b.kind === 'bud' ? '#sprig-bud' : '#sprig-flower'}
          transform={`translate(${n(b.tip[0])} ${n(b.tip[1])}) rotate(${n(facing(b.ctrl, b.tip))})`}
        />
      ))}

      {LEAVES.map((l, i) => (
        <use
          key={`l${i}`}
          href="#sprig-leaf"
          transform={`translate(${n(l.x)} ${n(l.y)}) rotate(${n(l.r)}) scale(${n(l.s)})`}
        />
      ))}
    </svg>
  );
}
