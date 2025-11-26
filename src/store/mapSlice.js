import { createSlice } from '@reduxjs/toolkit'

let savedPins = [];
let savedNextPinId = 1;
try {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem('pins');
    savedPins = raw ? JSON.parse(raw) : [];
    const nextRaw = localStorage.getItem('nextPinId');
    if (nextRaw) {
      const parsed = parseInt(nextRaw, 10);
      if (!Number.isNaN(parsed)) savedNextPinId = parsed;
    } else {
      if (Array.isArray(savedPins) && savedPins.length) {
        const maxId = Math.max(...savedPins.map(p => (typeof p.id === 'number' ? p.id : 0)));
        savedNextPinId = maxId + 1;
      }
    }
  }
} catch (e) {
  savedPins = [];
  savedNextPinId = 1;
}

const initialState = {
  pins: savedPins,
  selectedPins: [],
  nextPinId: savedNextPinId,
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addPin(state, action) {
      const { lat, lon, label } = action.payload;
      const pin = {
        id: state.nextPinId,
        lat,
        lon,
        label: label || `Pin ${state.nextPinId}`
      };
      state.pins.push(pin);
      state.nextPinId += 1;

      localStorage.setItem("pins", JSON.stringify(state.pins));
      localStorage.setItem("nextPinId", state.nextPinId.toString());
    },
    removePin(state, action) {
      const { pinId } = action.payload;
      state.pins = state.pins.filter(pin => pin.id !== pinId);
      state.selectedPins = state.selectedPins.filter(id => id !== pinId);

      localStorage.setItem("pins", JSON.stringify(state.pins));
      localStorage.setItem("nextPinId", state.nextPinId.toString());
    },
    togglePinSelection(state, action) {
      const { pinId } = action.payload;
      const idx = state.selectedPins.indexOf(pinId);
      if (idx === -1) {
        state.selectedPins.push(pinId);
      } else {
        state.selectedPins.splice(idx, 1);
      }
    },
    clearSelectedPins(state) {
      state.pins = state.pins.filter(pin => !state.selectedPins.includes(pin.id));
      state.selectedPins = [];

      localStorage.setItem("pins", JSON.stringify(state.pins));
      localStorage.setItem("nextPinId", state.nextPinId.toString());
    }
  },
})

export const { addPin, removePin, togglePinSelection, clearSelectedPins } = mapSlice.actions

export const selectAllPins = (state) => state.map.pins
export const selectSelectedPins = (state) => state.map.selectedPins
export const selectPinById = (state, pinId) => state.map.pins.find(pin => pin.id === pinId)

export default mapSlice.reducer