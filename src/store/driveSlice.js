import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  straight: 0,
  steer: 0
}

const driveSlice = createSlice({
  name: "drive",
  initialState,
  reducers: {
    requestDrive(state, action) {
      const { straight, steer } = action.payload;
      state.straight = straight;
      state.steer = steer;
    }
  }
});

export const { requestDrive } = driveSlice.actions;

export default driveSlice.reducer;
