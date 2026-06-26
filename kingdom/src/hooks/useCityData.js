import { useState, useEffect } from 'react'

export default function useCityData() {
  const [state, setState] = useState({
    city: null,
    ventures: [],
    ideas: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => setState({ ...data, loading: false, error: null }))
      .catch(err => setState(s => ({ ...s, loading: false, error: err.message })))
  }, [])

  return state
}
