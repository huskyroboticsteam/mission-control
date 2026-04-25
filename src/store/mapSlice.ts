import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from './store.js'
import {getItem} from '../util/localStorage.js'

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
  pins: getItem('pins') ?? [],
  selected: [],
  nextPinID: getItem('nextPinID') ?? 1,
}

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addPin: (
      state,
      action: PayloadAction<{lat: number; lon: number; label: string | undefined}>
    ) => {
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
    },

    removePin: (state, action: PayloadAction<{pinID: number}>) => {
      const {pinID} = action.payload
      state.pins = state.pins.filter((pin) => pin.id !== pinID)
      state.selected = state.selected.filter((id) => id !== pinID)
    },

    togglePinSelection: (state, action: PayloadAction<{pinID: number}>) => {
      const {pinID} = action.payload
      const idx = state.selected.indexOf(pinID)
      if (idx === -1) {
        state.selected.push(pinID)
      } else {
        state.selected.splice(idx, 1)
      }
    },

    clearSelectedPins: (state) => {
      state.pins = state.pins.filter((pin) => !state.selected.includes(pin.id))
      state.selected = []
    },

    resetPinCounter: (state) => {
      state.nextPinID = 1
    },
  },
})

export const {addPin, removePin, togglePinSelection, clearSelectedPins, resetPinCounter} =
  mapSlice.actions

export const selectAllPins = (state: RootState) => state.map.pins
export const selectSelectedPins = (state: RootState) => state.map.selected

export default mapSlice.reducer
