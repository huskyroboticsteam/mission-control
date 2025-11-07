import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pins: [],
  selectedPins: [], 
  nextPinId: 1 
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addPin(state, action) {
      const { lat, lon, label } = action.payload
      const pin = {
        id: state.nextPinId,
        lat,
        lon,
        label: label || `Pin ${state.nextPinId}`
      }
      state.pins.push(pin)
      state.nextPinId += 1
    },
    removePin(state, action) {
      const { pinId } = action.payload
      state.pins = state.pins.filter(pin => pin.id !== pinId)
      state.selectedPins = state.selectedPins.filter(id => id !== pinId)
    },
    togglePinSelection(state, action) {
      const { pinId } = action.payload
      const index = state.selectedPins.indexOf(pinId)
      if (index === -1) {
        state.selectedPins.push(pinId)
      } else {
        state.selectedPins.splice(index, 1)
      }
    },
    clearSelectedPins(state) {
      state.pins = state.pins.filter(pin => !state.selectedPins.includes(pin.id))
      state.selectedPins = []
    }
  },
})

export const { addPin, removePin, togglePinSelection, clearSelectedPins } = mapSlice.actions

export const selectAllPins = (state) => state.map.pins
export const selectSelectedPins = (state) => state.map.selectedPins
export const selectPinById = (state, pinId) => state.map.pins.find(pin => pin.id === pinId)

export default mapSlice.reducer