import Building, { TW, TH, TD, SVG_H } from './Building'

const GRID_COLS = 4
const GRID_ROWS = 4
const EXTRA_TOP = 48  // headroom above grid for tree canopies

function isoPos(col, row) {
  return {
    x: (col - row) * (TW / 2),
    y: (col + row) * (TH / 2),
  }
}

const CANVAS_W = (GRID_COLS + GRID_ROWS - 1) * (TW / 2) + TW          // 432
const CANVAS_H = (GRID_COLS + GRID_ROWS - 1) * (TH / 2) + SVG_H + EXTRA_TOP  // 336
const OFFSET_X = (GRID_ROWS - 1) * (TW / 2) + TW / 2                  // 192
const OFFSET_Y = TH / 2 + EXTRA_TOP                                     // 72

function buildGrid(ventures) {
  const map = {}
  for (const v of ventures) map[`${v.col},${v.row}`] = v
  const cells = []
  for (let row = 0; row < GRID_ROWS; row++)
    for (let col = 0; col < GRID_COLS; col++)
      cells.push({ col, row, venture: map[`${col},${row}`] || null })
  return cells
}

function Tree({ cx, cy, scale = 1 }) {
  const s = scale
  return (
    <g>
      <rect x={cx - 4*s} y={cy} width={8*s} height={20*s} fill="#3a2a18" />
      <ellipse cx={cx} cy={cy - 5*s}  rx={22*s} ry={14*s} fill="#1a3c10" />
      <ellipse cx={cx} cy={cy - 18*s} rx={17*s} ry={11*s} fill="#2a5a1a" />
      <ellipse cx={cx} cy={cy - 28*s} rx={11*s} ry={8*s}  fill="#3a7020" />
    </g>
  )
}

export default function CityGrid({ ventures, selected, onSelect }) {
  const cells = buildGrid(ventures)

  // Anchor points for back-corner tree clusters
  const tlx = OFFSET_X + isoPos(0, 0).x - TW / 2  // 144
  const tly = OFFSET_Y + isoPos(0, 0).y             // 72
  const trx = OFFSET_X + isoPos(3, 0).x - TW / 2  // 288
  const try_ = OFFSET_Y + isoPos(3, 0).y            // 144

  return (
    <div className="city-grid-wrap">
      <svg
        className="city-grid"
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H + 16}`}
        style={{ width: '100%', maxWidth: CANVAS_W, height: 'auto', display: 'block' }}
      >
        <defs>
          <pattern id="cobblestone" width="24" height="12" patternUnits="userSpaceOnUse">
            <rect width="24" height="12" fill="#3a3530" />
            <rect x="1"  y="1" width="10" height="4" rx="0.5" fill="#6e6458" />
            <rect x="13" y="1" width="10" height="4" rx="0.5" fill="#726860" />
            <rect x="1"  y="7" width="10" height="4" rx="0.5" fill="#686050" />
            <rect x="13" y="7" width="10" height="4" rx="0.5" fill="#6a6254" />
          </pattern>

          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="50%"  stopColor="transparent" />
            <stop offset="100%" stopColor="#1a2340" stopOpacity="0.75" />
          </radialGradient>
        </defs>

        {/* Tree clusters — painted before tiles so tiles overlap their bases */}
        <Tree cx={tlx + 20} cy={tly + 16} />
        <Tree cx={tlx - 4}  cy={tly + 30} scale={0.8} />
        <Tree cx={trx + TW + 12} cy={try_ + 16} />
        <Tree cx={trx + TW + 32} cy={try_ + 30} scale={0.85} />

        {/* Buildings layer (painter's order: back to front) */}
        {cells.map(({ col, row, venture }) => {
          const { x, y } = isoPos(col, row)
          const tx = OFFSET_X + x - TW / 2
          const ty = OFFSET_Y + y
          return (
            <g key={`b-${col}-${row}`} transform={`translate(${tx}, ${ty})`}>
              <Building
                venture={venture}
                isSelected={venture && venture.id === selected}
                onClick={venture ? () => onSelect(venture.id) : undefined}
              />
            </g>
          )
        })}

        {/* Labels layer — on top of all tiles */}
        {cells.map(({ col, row, venture }) => {
          if (!venture || (venture.status !== 'earning' && venture.status !== 'building')) return null
          const { x, y } = isoPos(col, row)
          const tx = OFFSET_X + x - TW / 2
          const ty = OFFSET_Y + y
          const label = venture.name.length > 18 ? venture.name.slice(0, 16) + '…' : venture.name
          return (
            <text
              key={`l-${col}-${row}`}
              x={tx + TW / 2}
              y={ty + SVG_H + 5}
              textAnchor="middle"
              fontSize={9}
              fill="#c9a84c"
              opacity={0.85}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {label}
            </text>
          )
        })}

        {/* Vignette overlay */}
        <rect
          x="0" y="0"
          width={CANVAS_W} height={CANVAS_H + 16}
          fill="url(#vignette)"
          style={{ pointerEvents: 'none' }}
        />
      </svg>
    </div>
  )
}
