import { useState } from 'react'
import useCityData from './hooks/useCityData'
import StatusBar from './components/StatusBar'
import CityGrid from './components/CityGrid'
import VenturePanel from './components/VenturePanel'
import IdeasBoard from './components/IdeasBoard'

export default function App() {
  const { city, ventures, ideas, loading, error } = useCityData()
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('city')

  if (loading) return <div className="loading">Loading the kingdom…</div>
  if (error)   return <div className="error">⚠ {error}</div>

  const selectedVenture = ventures.find(v => v.id === selected) || null

  function handleSelect(id) {
    setSelected(prev => prev === id ? null : id)
  }

  return (
    <div className="app">
      <StatusBar
        city={city}
        ventures={ventures}
        view={view}
        onViewChange={v => { setView(v); setSelected(null) }}
      />
      <main className="main">
        {view === 'city' ? (
          <>
            <CityGrid
              ventures={ventures}
              selected={selected}
              onSelect={handleSelect}
            />
            {selectedVenture && (
              <VenturePanel
                venture={selectedVenture}
                onClose={() => setSelected(null)}
              />
            )}
          </>
        ) : (
          <IdeasBoard ideas={ideas} />
        )}
      </main>
    </div>
  )
}
