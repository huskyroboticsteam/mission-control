import {createSlice} from '@reduxjs/toolkit'

const normalizePoint = (point) => {
  if (!Array.isArray(point) || point.length < 2) {
    return null
  }

  const lat = Number.parseFloat(point[0])
  const lon = Number.parseFloat(point[1])

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return null
  }

  return [lat, lon]
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
