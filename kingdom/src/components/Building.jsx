// Isometric building tile — SVG-based, 3 faces
const TW = 96  // tile width
const TH = 48  // tile height (top diamond height)
const TD = 36  // wall depth
const SVG_H = TH + TD

// Face path helpers
const topFace    = `M${TW/2},0 L${TW},${TH/2} L${TW/2},${TH} L0,${TH/2} Z`
const leftFace   = `M0,${TH/2} L${TW/2},${TH} L${TW/2},${TH+TD} L0,${TH/2+TD} Z`
const rightFace  = `M${TW/2},${TH} L${TW},${TH/2} L${TW},${TH/2+TD} L${TW/2},${TH+TD} Z`

const COLORS = {
  'empty-lot': {
    top: '#3a5c28', left: null, right: null,
    topStroke: '#2a4418',
  },
  idea: {
    top: '#1e3860', left: null, right: null,
    topStroke: '#3a5a9a', topDash: '6,4',
  },
  building: {
    top: '#7d6448', left: '#4a3528', right: '#5e4333',
    topStroke: '#9e8060',
  },
  earning: {
    top: '#a0823a', left: '#6a5018', right: '#8a6820',
    topStroke: '#c9a84c',
  },
}

// Small gold window dots on the walls
function EarningWindows() {
  return (
    <>
      {/* Left wall windows */}
      <rect x={8}  y={TH/2 + 8}  width={10} height={7} rx={1} fill="#c9a84c" opacity={0.9} transform={`skewX(${-26.5})`} />
      <rect x={24} y={TH/2 + 16} width={10} height={7} rx={1} fill="#c9a84c" opacity={0.8} transform={`skewX(${-26.5})`} />
      {/* Right wall windows */}
      <rect x={TW/2 + 8}  y={TH/2 + 8}  width={10} height={7} rx={1} fill="#c9a84c" opacity={0.9} transform={`skewX(${26.5})`} />
      <rect x={TW/2 + 24} y={TH/2 + 16} width={10} height={7} rx={1} fill="#c9a84c" opacity={0.7} transform={`skewX(${26.5})`} />
    </>
  )
}

// Scaffold lines on building-status buildings
function ScaffoldLines() {
  return (
    <g stroke="#c9a84c" strokeWidth={1} opacity={0.35}>
      <line x1={0}     y1={TH/2 + TD/2} x2={TW/2} y2={TH + TD/2} />
      <line x1={TW/2}  y1={TH}          x2={TW/2} y2={TH+TD} />
      <line x1={TW/2}  y1={TH + TD/2}   x2={TW}   y2={TH/2 + TD/2} />
    </g>
  )
}

// Blueprint dashed cross for idea status
function BlueprintMarks() {
  return (
    <g stroke="#4c7abf" strokeWidth={1} opacity={0.6} strokeDasharray="4,3">
      <line x1={TW/2} y1={4}    x2={TW/2} y2={TH-4} />
      <line x1={TW/6} y1={TH/3} x2={TW*5/6} y2={TH/3} />
    </g>
  )
}

export default function Building({ venture, isSelected, onClick }) {
  const status = venture?.status || 'empty-lot'
  const colors = COLORS[status] || COLORS['empty-lot']
  const hasWalls = status === 'building' || status === 'earning'
  const label = venture?.name || ''

  return (
    <g
      onClick={onClick}
      style={{ cursor: venture ? 'pointer' : 'default' }}
      role={venture ? 'button' : undefined}
      aria-label={venture ? `Open ${label}` : undefined}
    >
      {/* Walls (behind top face) */}
      {hasWalls && colors.left && (
        <path d={leftFace}  fill={colors.left}  />
      )}
      {hasWalls && colors.right && (
        <path d={rightFace} fill={colors.right} />
      )}

      {/* Top face */}
      <path
        d={topFace}
        fill={colors.top}
        stroke={isSelected ? '#c9a84c' : colors.topStroke || 'transparent'}
        strokeWidth={isSelected ? 1.5 : 0.8}
        strokeDasharray={colors.topDash}
      />

      {/* Status decorations */}
      {status === 'earning'  && <EarningWindows />}
      {status === 'building' && <ScaffoldLines />}
      {status === 'idea'     && <BlueprintMarks />}

      {/* Selection glow ring */}
      {isSelected && (
        <path
          d={topFace}
          fill="none"
          stroke="#c9a84c"
          strokeWidth={2}
          opacity={0.6}
        />
      )}
    </g>
  )
}

export { TW, TH, TD, SVG_H }
