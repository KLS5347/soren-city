export default function StatusBar({ city, ventures, view, onViewChange }) {
  const totalRevenue = ventures.reduce((s, v) => s + (v.revenue || 0), 0)

  return (
    <header className="status-bar">
      <span className="status-bar__crest" title="SMG">⚔</span>
      <div className="status-bar__title">
        <div className="status-bar__city">{city?.cityName ?? 'Soren City'}</div>
        <div className="status-bar__ceo">Sovereign: {city?.ceo ?? 'Kaleb Sorenson'}</div>
      </div>
      <div className="status-bar__right">
        <div className="status-bar__revenue">
          Treasury: <span>${totalRevenue.toLocaleString()}</span>
        </div>
        <nav className="status-bar__nav">
          <button
            className={`nav-btn${view === 'city' ? ' active' : ''}`}
            onClick={() => onViewChange('city')}
          >
            Kingdom
          </button>
          <button
            className={`nav-btn${view === 'ideas' ? ' active' : ''}`}
            onClick={() => onViewChange('ideas')}
          >
            Ideas
          </button>
        </nav>
      </div>
    </header>
  )
}
