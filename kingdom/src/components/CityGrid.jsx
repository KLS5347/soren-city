import Building, { TW, TH, TD, SVG_H } from './Building'

const GRID_COLS = 4
const GRID_ROWS = 4

// Isometric screen position for a grid cell (col, row)
function isoPos(col, row) {
  return {
    x: (col - row) * (TW / 2),
    y: (col + row) * (TH / 2),
  }
}

// Total canvas size
const CANVAS_W = (GRID_COLS + GRID_ROWS - 1) * (TW / 2) + TW
const CANVAS_H = (GRID_COLS + GRID_ROWS - 1) * (TH / 2) + SVG_H

// Offset so (0,0) tile is positioned correctly
const OFFSET_X = (GRID_ROWS - 1) * (TW / 2) + TW / 2
const OFFSET_Y = TH / 2

// Build the full 4×4 grid: venture at each position, or null
function buildGrid(ventures) {
  const map = {}
  for (const v of ventures) {
    map[`${v.col},${v.row}`] = v
  }
  // Render back-to-front (painter's algorithm): row asc, then col asc
  const cells = []
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      cells.push({ col, row, venture: map[`${col},${row}`] || null })
    }
  }
  return cells
}

export default function CityGrid({ ventures, selected, onSelect }) {
  const cells = buildGrid(ventures)

  return (
    <div className="city-grid-wrap">
      <svg
        className="city-grid"
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H + 16}`}
        style={{ width: '100%', maxWidth: CANVAS_W, height: 'auto', display: 'block' }}
      >
        {/* Buildings layer (painter's order) */}
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

        {/* Labels layer — rendered on top of all tiles */}
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
      </svg>
    </div>
  )
}
