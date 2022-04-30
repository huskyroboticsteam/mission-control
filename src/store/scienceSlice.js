import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  lazySusanPosition: 0,
  syringeDepth: 1,
  microscopeFocus: 1.0,
  lidClosed: true
};

const scienceSlice = createSlice({
  name: "science",
  initialState,
  reducers: {
    requestLidPosition(state, action) {
      const { closed } = action.payload;
      state.lidClosed = closed;
    },

    requestLazySusanPosition(state, action) {
      const { position } = action.payload;
      state.lazySusanPosition = position;
     },

     requestSyringePosition(state, action) {
       const { depth } = action.payload;
       state.syringeDepth = depth;
     }
  }
});

export const {
  requestLidPosition,
  requestLazySusanPosition,
  requestSyringePosition
} = scienceSlice.actions;

export const selectLazySusanPosition = state => state.science.lazySusanPosition;
export const selectLidPosition = state => state.science.lidClosed;
export const selectSyringePosition = state => state.science.syringeDepth;

export default scienceSlice.reducer;
