import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  lazySusanPosition: 0,
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
     }
  }
});

export const {
  requestLidPosition,
  requestLazySusanPosition
} = scienceSlice.actions;

export const selectLazySusanPosition = state => state.science.lazySusanPosition;
export const selectLidPosition = state => state.science.lidClosed;

export default scienceSlice.reducer;
