import { useState } from 'react'

const STAGES = ['all', 'proposed', 'approved', 'active', 'rejected']

const SCORE_KEYS = ['revenue', 'speed', 'leverage', 'cost']
const SCORE_LABELS = { revenue: 'Revenue', speed: 'Speed', leverage: 'Leverage', cost: 'Cost' }

function ScoreRow({ label, value, colorKey }) {
  return (
    <div className="score-row">
      <span className="score-row__label">{label}</span>
      <div className="score-row__bar-bg">
        <div
          className={`score-row__bar-fill score-row__bar-fill--${colorKey}`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="score-row__val">{value}</span>
    </div>
  )
}

export default function IdeasBoard({ ideas }) {
  const [stage, setStage] = useState('all')

  const filtered = stage === 'all' ? ideas : ideas.filter(i => i.stage === stage)

  return (
    <div className="ideas-board">
      <div className="ideas-board__header">
        <h2 className="ideas-board__title">The Scheme Smithy</h2>
        <div className="ideas-filter">
          {STAGES.map(s => (
            <button
              key={s}
              className={`filter-btn${stage === s ? ' active' : ''}`}
              onClick={() => setStage(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="ideas-grid">
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No ideas in this stage.
          </p>
        )}
        {filtered.map(idea => (
          <div key={idea.id} className="idea-card">
            <div className="idea-card__header">
              <span className="idea-card__name">{idea.name}</span>
              <span className="idea-card__by">{idea.proposedBy}</span>
            </div>
            <p className="idea-card__pitch">{idea.pitch}</p>
            <div className="idea-card__scores">
              {SCORE_KEYS.map(k => (
                <ScoreRow
                  key={k}
                  label={SCORE_LABELS[k]}
                  value={idea.scores[k] ?? 0}
                  colorKey={k}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
