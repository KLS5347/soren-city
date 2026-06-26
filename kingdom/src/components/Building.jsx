// Isometric building tile — SVG-based, 3 faces
const TW = 96  // tile width
const TH = 48  // tile height (top diamond height)
const TD = 72  // wall depth (was 36)
const SVG_H = TH + TD  // 120

const topFace   = `M${TW/2},0 L${TW},${TH/2} L${TW/2},${TH} L0,${TH/2} Z`
const leftFace  = `M0,${TH/2} L${TW/2},${TH} L${TW/2},${TH+TD} L0,${TH/2+TD} Z`
const rightFace = `M${TW/2},${TH} L${TW},${TH/2} L${TW},${TH/2+TD} L${TW/2},${TH+TD} Z`

const COLORS = {
  'empty-lot': {
    top: 'url(#cobblestone)', left: null, right: null,
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

// Horizontal stone coursing lines on building walls
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

  return (
    <g
      onClick={onClick}
      style={{ cursor: venture ? 'pointer' : 'default' }}
      role={venture ? 'button' : undefined}
      aria-label={venture ? `Open ${venture.name}` : undefined}
    >
      {hasWalls && colors.left  && <path d={leftFace}  fill={colors.left}  />}
      {hasWalls && colors.right && <path d={rightFace} fill={colors.right} />}

      <path
        d={topFace}
        fill={colors.top}
        stroke={isSelected ? '#c9a84c' : colors.topStroke || 'transparent'}
        strokeWidth={isSelected ? 1.5 : 0.8}
        strokeDasharray={colors.topDash}
      />

      {status === 'earning'  && <EarningWindows />}
      {status === 'building' && <StoneCoursing />}
      {status === 'idea'     && <BlueprintMarks />}

      {isSelected && (
        <path d={topFace} fill="none" stroke="#c9a84c" strokeWidth={2} opacity={0.6} />
      )}
    </g>
  )
}

export { TW, TH, TD, SVG_H }
