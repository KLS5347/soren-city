// Isometric building tile — SVG-based, 3 faces
const TW = 96   // tile width
const TH = 48   // tile height (top diamond)
const TD = 72   // building wall depth
const TD_G = 16 // ground platform edge depth
const SVG_H = TH + TD  // 120

const topFace    = `M${TW/2},0 L${TW},${TH/2} L${TW/2},${TH} L0,${TH/2} Z`
const leftFace   = `M0,${TH/2} L${TW/2},${TH} L${TW/2},${TH+TD} L0,${TH/2+TD} Z`
const rightFace  = `M${TW/2},${TH} L${TW},${TH/2} L${TW},${TH/2+TD} L${TW/2},${TH+TD} Z`
const groundLeft = `M0,${TH/2} L${TW/2},${TH} L${TW/2},${TH+TD_G} L0,${TH/2+TD_G} Z`
const groundRight= `M${TW/2},${TH} L${TW},${TH/2} L${TW},${TH/2+TD_G} L${TW/2},${TH+TD_G} Z`

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

// Gold lit windows spread vertically along walls
function EarningWindows() {
  return (
    <>
      <rect x={6}  y={TH/2 + TD/3}   width={10} height={7} rx={1} fill="#c9a84c" opacity={0.9} transform={`skewX(${-26.5})`} />
      <rect x={22} y={TH/2 + TD*2/3} width={10} height={7} rx={1} fill="#c9a84c" opacity={0.8} transform={`skewX(${-26.5})`} />
      <rect x={TW/2 + 8}  y={TH/2 + TD/3}   width={10} height={7} rx={1} fill="#c9a84c" opacity={0.9} transform={`skewX(${26.5})`} />
      <rect x={TW/2 + 22} y={TH/2 + TD*2/3} width={10} height={7} rx={1} fill="#c9a84c" opacity={0.8} transform={`skewX(${26.5})`} />
    </>
  )
}

// Horizontal stone block lines on building walls
function StoneCoursing() {
  const offsets = [TD / 4, TD / 2, (3 * TD) / 4]
  return (
    <g stroke="#3a3028" strokeWidth={0.8} opacity={0.65}>
      {offsets.map((d, i) => (
        <g key={i}>
          <line x1={0}    y1={TH/2 + d} x2={TW/2} y2={TH + d} />
          <line x1={TW/2} y1={TH + d}   x2={TW}   y2={TH/2 + d} />
        </g>
      ))}
    </g>
  )
}

// Vertical corner column lines
function ColumnLines() {
  return (
    <g stroke="#3a3028" strokeWidth={2.5} opacity={0.45}>
      <line x1={2}    y1={TH/2 + 2} x2={2}    y2={TH/2 + TD - 2} />
      <line x1={TW-2} y1={TH/2 + 2} x2={TW-2} y2={TH/2 + TD - 2} />
      <line x1={TW/2} y1={TH + 2}   x2={TW/2} y2={TH + TD - 2} />
    </g>
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

// foundry: forge chimney stack on right wall
function ChimneyDetail() {
  return (
    <g>
      <rect x={TW - 14} y={TH/2 - 4} width={10} height={TD / 3} fill="#2a2018" />
      <rect x={TW - 16} y={TH/2 - 7} width={14} height={4}      fill="#221810" />
      <ellipse cx={TW - 9} cy={TH/2 - 12} rx={5} ry={3} fill="#706860" opacity={0.4} />
    </g>
  )
}

// office: grand arched entrance at front wall base
function ArchwayDetail() {
  const cx  = TW * 3 / 4
  const base = TH + TD
  const top  = TH + TD / 2
  return (
    <path
      d={`M${cx-11},${base} L${cx-11},${top} Q${cx},${top-13} ${cx+11},${top} L${cx+11},${base}`}
      fill="#1e1810" stroke="#6a6050" strokeWidth={1}
    />
  )
}

// guild: bell arch window on left wall
function BellDetail() {
  return (
    <g>
      <rect x={8} y={TH/2 + 8} width={16} height={TD / 3} rx={1} fill="#1e1810" opacity={0.85} />
      <ellipse cx={16} cy={TH/2 + 8} rx={8} ry={5} fill="#1e1810" opacity={0.85} />
    </g>
  )
}

// bot: hanging shop sign on right wall
function SignDetail() {
  const sx = TW * 2 / 3
  const sy = TH/2 + TD / 3
  return (
    <g>
      <line x1={sx} y1={sy} x2={sx + 12} y2={sy} stroke="#9a8050" strokeWidth={1.5} />
      <rect x={sx + 10} y={sy - 6} width={14} height={10} rx={1} fill="#c9a84c" opacity={0.72} />
    </g>
  )
}

function BuildingExtra({ id }) {
  switch (id) {
    case 'foundry': return <ChimneyDetail />
    case 'office':  return <ArchwayDetail />
    case 'guild':   return <BellDetail />
    case 'bot':     return <SignDetail />
    default:        return null
  }
}

export default function Building({ venture, isSelected, onClick }) {
  const status = venture?.status || 'empty-lot'
  const colors  = COLORS[status] || COLORS['empty-lot']
  const isGround  = status === 'empty-lot'
  const hasWalls  = status === 'building' || status === 'earning'

  return (
    <g
      onClick={onClick}
      style={{ cursor: venture ? 'pointer' : 'default' }}
      role={venture ? 'button' : undefined}
      aria-label={venture ? `Open ${venture.name}` : undefined}
    >
      {/* Ground platform edge (shallow) */}
      {isGround && (
        <>
          <path d={groundLeft}  fill={colors.left}  />
          <path d={groundRight} fill={colors.right} />
        </>
      )}

      {/* Building walls (tall) */}
      {hasWalls && colors.left  && <path d={leftFace}  fill={colors.left}  />}
      {hasWalls && colors.right && <path d={rightFace} fill={colors.right} />}

      {/* Top face */}
      <path
        d={topFace}
        fill={colors.top}
        stroke={isSelected ? '#c9a84c' : colors.topStroke || 'transparent'}
        strokeWidth={isSelected ? 1.5 : 0.8}
        strokeDasharray={colors.topDash}
      />

      {/* Wall details */}
      {hasWalls && <ColumnLines />}
      {hasWalls && <StoneCoursing />}
      {status === 'earning'  && <EarningWindows />}
      {status === 'idea'     && <BlueprintMarks />}

      {/* Unique per-building element */}
      {hasWalls && <BuildingExtra id={venture?.id} />}

      {/* Selection glow */}
      {isSelected && (
        <path d={topFace} fill="none" stroke="#c9a84c" strokeWidth={2} opacity={0.6} />
      )}
    </g>
  )
}

export { TW, TH, TD, SVG_H }
