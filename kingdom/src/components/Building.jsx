// Isometric building tile — SVG-based, 3 faces
const TW = 96   // tile width
const TH = 48   // tile height (top diamond)
const TD = 120  // base building wall depth (used for canvas layout)
const TD_G = 16 // ground platform edge depth
const SVG_H = TH + TD  // 168

// Per-venture wall heights (fraction of TD)
const VENTURE_HEIGHT = {
  office:  1.25,  // Throne Room — grandest, most imposing
  foundry: 1.05,  // Scheme Smithy — solid, industrial
  guild:   0.95,  // Town Crier's — civic, moderate
  bot:     0.75,  // Chatte Shoppe — small, cozy
}

function ventureHeight(id) {
  return Math.round(TD * (VENTURE_HEIGHT[id] || 1.0))
}

const topFace    = `M${TW/2},0 L${TW},${TH/2} L${TW/2},${TH} L0,${TH/2} Z`
const groundLeft = `M0,${TH/2} L${TW/2},${TH} L${TW/2},${TH+TD_G} L0,${TH/2+TD_G} Z`
const groundRight= `M${TW/2},${TH} L${TW},${TH/2} L${TW},${TH/2+TD_G} L${TW/2},${TH+TD_G} Z`

function wallPaths(td) {
  return {
    left:  `M0,${TH/2} L${TW/2},${TH} L${TW/2},${TH+td} L0,${TH/2+td} Z`,
    right: `M${TW/2},${TH} L${TW},${TH/2} L${TW},${TH/2+td} L${TW/2},${TH+td} Z`,
  }
}

const COLORS = {
  'empty-lot': {
    top: 'url(#cobblestone)', left: '#4a4438', right: '#5c5248',
    topStroke: '#4a4238',
  },
  idea: {
    top: '#1a2e50', left: null, right: null,
    topStroke: '#3a5a9a', topDash: '6,4',
  },
  building: {
    top: '#8a7c6a', left: '#5a5048', right: '#6e6258',
    topStroke: '#a09080',
  },
  earning: {
    top: '#9a8040', left: '#6a5820', right: '#7e6c2a',
    topStroke: '#c9a84c',
  },
}

// Stone block horizontal coursing
function StoneCoursing({ td }) {
  const offsets = [td / 4, td / 2, (3 * td) / 4]
  return (
    <g stroke="#3a3028" strokeWidth={0.8} opacity={0.6}>
      {offsets.map((d, i) => (
        <g key={i}>
          <line x1={0}    y1={TH/2 + d} x2={TW/2} y2={TH + d} />
          <line x1={TW/2} y1={TH + d}   x2={TW}   y2={TH/2 + d} />
        </g>
      ))}
    </g>
  )
}

// Vertical corner columns
function ColumnLines({ td }) {
  return (
    <g stroke="#3a3028" strokeWidth={2.5} opacity={0.4}>
      <line x1={2}    y1={TH/2 + 2} x2={2}    y2={TH/2 + td - 2} />
      <line x1={TW-2} y1={TH/2 + 2} x2={TW-2} y2={TH/2 + td - 2} />
      <line x1={TW/2} y1={TH + 2}   x2={TW/2} y2={TH + td - 2} />
    </g>
  )
}

// Dark window openings on both wall faces
function Windows({ td }) {
  const row1 = td / 3
  const row2 = td * 2 / 3
  return (
    <>
      <rect x={10} y={TH/2 + row1} width={10} height={8} rx={1} fill="#1a1810" opacity={0.82} transform="skewX(-26.5)" />
      <rect x={28} y={TH/2 + row2} width={10} height={8} rx={1} fill="#1a1810" opacity={0.72} transform="skewX(-26.5)" />
      <rect x={TW/2 + 8}  y={TH/2 + row1} width={10} height={8} rx={1} fill="#1a1810" opacity={0.82} transform="skewX(26.5)" />
      <rect x={TW/2 + 22} y={TH/2 + row2} width={10} height={8} rx={1} fill="#1a1810" opacity={0.72} transform="skewX(26.5)" />
    </>
  )
}

// Gold lit windows for earning status
function EarningWindows({ td }) {
  return (
    <>
      <rect x={10} y={TH/2 + td/3}   width={10} height={8} rx={1} fill="#c9a84c" opacity={0.9}  transform="skewX(-26.5)" />
      <rect x={28} y={TH/2 + td*2/3} width={10} height={8} rx={1} fill="#c9a84c" opacity={0.8}  transform="skewX(-26.5)" />
      <rect x={TW/2 + 8}  y={TH/2 + td/3}   width={10} height={8} rx={1} fill="#c9a84c" opacity={0.9}  transform="skewX(26.5)" />
      <rect x={TW/2 + 22} y={TH/2 + td*2/3} width={10} height={8} rx={1} fill="#c9a84c" opacity={0.8}  transform="skewX(26.5)" />
    </>
  )
}

function BlueprintMarks() {
  return (
    <g stroke="#4c7abf" strokeWidth={1} opacity={0.6} strokeDasharray="4,3">
      <line x1={TW/2} y1={4}    x2={TW/2} y2={TH-4} />
      <line x1={TW/6} y1={TH/3} x2={TW*5/6} y2={TH/3} />
    </g>
  )
}

// --- Per-building unique architectural details ---

// foundry: chimney stack on right wall
function ChimneyDetail({ td }) {
  return (
    <g>
      <rect x={TW - 14} y={TH/2 - 6}  width={10} height={td / 3} fill="#2a2018" />
      <rect x={TW - 16} y={TH/2 - 10} width={14} height={5}      fill="#1e1610" />
      <ellipse cx={TW - 9} cy={TH/2 - 14} rx={5} ry={3} fill="#706860" opacity={0.38} />
    </g>
  )
}

// office: grand arched entrance at front wall base
function ArchwayDetail({ td }) {
  const cx   = TW * 3 / 4
  const base = TH + td
  const top  = TH + td * 0.45
  return (
    <path
      d={`M${cx-12},${base} L${cx-12},${top} Q${cx},${top-14} ${cx+12},${top} L${cx+12},${base}`}
      fill="#1e1810" stroke="#6a6050" strokeWidth={1}
    />
  )
}

// office: crenellated parapet along the roof line
function Parapet() {
  const notches = [18, 36, 54, 66]
  return (
    <g fill="#7a7060" stroke="#5a5040" strokeWidth={0.5}>
      {notches.map((x, i) => (
        <rect key={i} x={TW/2 - 12 + x/2} y={-6} width={5} height={6} rx={0.5} transform={`skewX(${i % 2 === 0 ? -26.5 : 26.5})`} />
      ))}
    </g>
  )
}

// guild: bell arch window on left wall
function BellDetail({ td }) {
  const y0 = TH/2 + td * 0.12
  return (
    <g>
      <rect x={8} y={y0} width={16} height={td / 3} rx={1} fill="#1e1810" opacity={0.85} />
      <ellipse cx={16} cy={y0} rx={8} ry={5} fill="#1e1810" opacity={0.85} />
    </g>
  )
}

// bot: hanging shop sign on right wall
function SignDetail({ td }) {
  const sx = TW * 2 / 3
  const sy = TH/2 + td * 0.28
  return (
    <g>
      <line x1={sx} y1={sy} x2={sx + 14} y2={sy} stroke="#9a8050" strokeWidth={1.5} />
      <rect x={sx + 12} y={sy - 7} width={16} height={11} rx={1} fill="#c9a84c" opacity={0.75} />
    </g>
  )
}

function BuildingExtra({ id, td }) {
  switch (id) {
    case 'foundry': return <ChimneyDetail td={td} />
    case 'office':  return <><ArchwayDetail td={td} /><Parapet /></>
    case 'guild':   return <BellDetail td={td} />
    case 'bot':     return <SignDetail td={td} />
    default:        return null
  }
}

export default function Building({ venture, isSelected, onClick }) {
  const status   = venture?.status || 'empty-lot'
  const colors   = COLORS[status] || COLORS['empty-lot']
  const isGround = status === 'empty-lot'
  const hasWalls = status === 'building' || status === 'earning'
  const td       = hasWalls ? ventureHeight(venture?.id) : TD_G
  const { left: leftFace, right: rightFace } = wallPaths(td)

  return (
    <g
      onClick={onClick}
      style={{ cursor: venture ? 'pointer' : 'default' }}
      role={venture ? 'button' : undefined}
      aria-label={venture ? `Open ${venture.name}` : undefined}
    >
      {/* Ground platform edge */}
      {isGround && (
        <>
          <path d={groundLeft}  fill={colors.left}  />
          <path d={groundRight} fill={colors.right} />
        </>
      )}

      {/* Building walls */}
      {hasWalls && colors.left  && <path d={leftFace}  fill={colors.left}  />}
      {hasWalls && colors.right && <path d={rightFace} fill={colors.right} />}

      {/* Roof / top face */}
      <path
        d={topFace}
        fill={colors.top}
        stroke={isSelected ? '#c9a84c' : colors.topStroke || 'transparent'}
        strokeWidth={isSelected ? 1.5 : 0.8}
        strokeDasharray={colors.topDash}
      />

      {/* Wall details */}
      {hasWalls && <ColumnLines td={td} />}
      {hasWalls && <StoneCoursing td={td} />}
      {hasWalls && status !== 'earning' && <Windows td={td} />}
      {status === 'earning'  && <EarningWindows td={td} />}
      {status === 'idea'     && <BlueprintMarks />}

      {/* Unique per-building element */}
      {hasWalls && <BuildingExtra id={venture?.id} td={td} />}

      {/* Selection glow */}
      {isSelected && (
        <path d={topFace} fill="none" stroke="#c9a84c" strokeWidth={2} opacity={0.6} />
      )}
    </g>
  )
}

export { TW, TH, TD, SVG_H }
