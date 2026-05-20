import {createSlice} from '@reduxjs/toolkit'

const normalizePoint = (point) => {
  if (!point || typeof point !== 'object') return null

  const lat = Number.parseFloat(point.lat)
  const lon = Number.parseFloat(point.lon)

  if (Number.isNaN(lat) || Number.isNaN(lon)) return null

  return {lat, lon}
}

const extraFields = (point) => {
  const radiusValue = Number.parseFloat(point?.radius ?? 0)
  const radius = Number.isNaN(radiusValue) ? 0 : radiusValue

  const tag = typeof point?.tag === 'string' ? point.tag : ''

  const circleMode = Boolean(point?.circleMode)

  return {radius, tag, circleMode}
}

const normalizeWaypoint = (point) => {
  const normalizedPoint = normalizePoint(point)
  if (normalizedPoint === null) return null

  return {
    ...normalizedPoint,
    ...extraFields(point),
  }
}

const resolveRequestMeta = (payload, points) => {
  const first = points[0] ?? {radius: 0, tag: '', circleMode: false}

  const hasTag = typeof payload?.tag === 'string'
  const hasCircleMode = typeof payload?.circleMode === 'boolean'
  const hasRadius = payload?.radius !== undefined && payload?.radius !== null
  const parsedRadius = Number.parseFloat(payload?.radius)

  return {
    tag: hasTag ? payload.tag : first.tag,
    circleMode: hasCircleMode ? payload.circleMode : first.circleMode,
    radius: hasRadius && !Number.isNaN(parsedRadius) ? parsedRadius : first.radius,
  }
}

const initialState = {
  points: [],
  tag: '',
  circleMode: false,
  radius: 0,
}

const waypointNavSlice = createSlice({
  name: 'waypointNav',
  initialState,
  reducers: {
    requestWaypointNav(state, action) {
      const rawPoints = action.payload?.points ?? []
      const nextPoints = Array.isArray(rawPoints) ? rawPoints : []
      state.points = nextPoints
        .map((point) => normalizeWaypoint(point))
        .filter((point) => point !== null)

      const meta = resolveRequestMeta(action.payload, state.points)
      state.tag = meta.tag
      state.circleMode = meta.circleMode
      state.radius = meta.radius
    },
    setPoints(state, action) {
      const payload = Array.isArray(action.payload) ? action.payload : []
      state.points = payload
        .map((point) => normalizeWaypoint(point))
        .filter((point) => point !== null)

      const first = state.points[0] ?? {radius: 0, tag: '', circleMode: false}
      state.tag = first.tag
      state.circleMode = first.circleMode
      state.radius = first.radius
    },
  },
})

export const {requestWaypointNav, setPoints} = waypointNavSlice.actions

export const selectPoints = (state) => state.waypointNav.points
export const selectWaypointRequestMeta = (state) => ({
  tag: state.waypointNav.tag,
  circleMode: state.waypointNav.circleMode,
  radius: state.waypointNav.radius,
})

export default waypointNavSlice.reducer
