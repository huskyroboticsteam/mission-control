import {createSlice} from '@reduxjs/toolkit'

const normalizePoint = (point) => {
  if (!point || typeof point !== 'object') return null

  const lat = Number.parseFloat(point.lat)
  const lon = Number.parseFloat(point.lon)

  const radius = Number.parseFloat(point.radius ?? 0)

  const tag = typeof point.tag === 'string' ? point.tag : ''

  const circleMode = Boolean(point.circleMode)

  if (Number.isNaN(lat) || Number.isNaN(lon) || Number.isNaN(radius)) return null

  return {lat, lon, radius, tag, circleMode}
}

const initialState = {
  points: [],
}

const waypointNavSlice = createSlice({
  name: 'waypointNav',
  initialState,
  reducers: {
    requestWaypointNav(state, action) {
      const rawPoints = action.payload?.points ?? []
      const nextPoints = Array.isArray(rawPoints) ? rawPoints : []
      state.points = nextPoints
        .map((point) => normalizePoint(point))
        .filter((point) => point !== null)
    },
    setPoints(state, action) {
      const payload = Array.isArray(action.payload) ? action.payload : []
      state.points = payload.map((point) => normalizePoint(point)).filter((point) => point !== null)
    },
  },
})

export const {requestWaypointNav, setPoints} = waypointNavSlice.actions

export const selectPoints = (state) => state.waypointNav.points

export default waypointNavSlice.reducer
