import {createSlice, type PayloadAction} from '@reduxjs/toolkit'

type Pin = {
  id: number
  lat: number
  lon: number
  label: string
}

type MapState = {
  readonly pins: Array<Pin>
  readonly selected: Array<number>
  readonly nextPinID: number
}

const initialState: MapState = {
  pins: [],
  selected: [],
  nextPinID: 1,
}

// let savedPins = []
// let savedNextPinId = 1
// try {
//   if (typeof localStorage !== 'undefined') {
//     const raw = localStorage.getItem('pins')
//     savedPins = raw ? JSON.parse(raw) : []

//     // Validate that savedPins is an array
//     if (!Array.isArray(savedPins)) {
//       console.warn('Loaded pins data is not an array, resetting to empty array')
//       savedPins = []
//     }

//     const nextRaw = localStorage.getItem('nextPinId')
//     if (nextRaw) {
//       const parsed = parseInt(nextRaw, 10)
//       if (!Number.isNaN(parsed)) savedNextPinId = parsed
//     } else {
//       if (Array.isArray(savedPins) && savedPins.length) {
//         const maxId = Math.max(...savedPins.map((p) => (typeof p.id === 'number' ? p.id : 0)))
//         savedNextPinId = maxId + 1
//       }
//     }
//   } else {
//     console.warn('localStorage is not available, pins will not be persisted')
//   }
// } catch (e) {
//   console.error('Failed to load saved pins from localStorage:', (e as Error).message || e)
//   savedPins = []
//   savedNextPinId = 1
// }

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addPin(state, action: PayloadAction<{lat: number; lon: number; label: string | undefined}>) {
      const {lat, lon, label} = action.payload

      // Validate latitude and longitude ranges
      if (lat < -90 || lat > 90) {
        console.error(`Invalid latitude: ${lat}. Must be between -90 and 90`)
        return state
      }
      if (lon < -180 || lon > 180) {
        console.error(`Invalid longitude: ${lon}. Must be between -180 and 180`)
        return state
      }

      const pin = {
        id: state.nextPinID,
        lat,
        lon,
        label: label || `Pin ${state.nextPinID}`,
      }
      state.pins.push(pin)
      state.nextPinID += 1
      // localStorage.setItem('pins', JSON.stringify(state.pins))
      // localStorage.setItem('nextPinId', state.nextPinId.toString())
    },
    removePin(state, action: PayloadAction<{pinID: number}>) {
      const {pinID} = action.payload
      state.pins = state.pins.filter((pin) => pin.id !== pinID)
      state.selected = state.selected.filter((id) => id !== pinID)

      localStorage.setItem('pins', JSON.stringify(state.pins))
      localStorage.setItem('nextPinId', state.nextPinID.toString())
    },
    togglePinSelection(state, action) {
      const {pinId} = action.payload
      const idx = (state.selected as number[]).indexOf(pinId)
      if (idx === -1) {
        ;(state.selected as number[]).push(pinId)
      } else {
        ;(state.selected as number[]).splice(idx, 1)
      }
    },
    clearSelectedPins(state) {
      state.pins = state.pins.filter((pin) => !(state.selected as number[]).includes(pin.id))
      state.selected = []

      localStorage.setItem('pins', JSON.stringify(state.pins))
      localStorage.setItem('nextPinId', state.nextPinID.toString())
    },
    resetPinCounter(state) {
      state.nextPinID = 1
      localStorage.setItem('nextPinId', '1')
    },
  },
})

export const {addPin, removePin, togglePinSelection, clearSelectedPins, resetPinCounter} =
  mapSlice.actions

export const selectAllPins = (state: any) => state.map.pins
export const selectSelectedPins = (state: any) => state.map.selectedPins
export const selectPinById = (state: any, pinId: number) =>
  state.map.pins.find((pin: any) => pin.id === pinId)

export default mapSlice.reducer
