import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  straight: 0,
  steer: 0,
  tankLeft: 0,
  tankRight: 0,
  holoLeft: 0,
  holoTurnccw: 0
};

const driveSlice = createSlice({
  name: "drive",
  initialState,
  reducers: {
    requestDrive(state, action) {
      const { straight, steer } = action.payload;
      state.straight = straight;
      state.steer = steer;
    },

    requestTankDrive(state, action) {
      const { tankLeft, tankRight } = action.payload;
      state.tankLeft = tankLeft;
      state.tankRight = tankRight;
    },

    requestHolonomicDrive(state, action) {
      const { straight, holoLeft, holoTurnccw } = action.payload;
      state.straight = straight;
      state.holoLeft = holoLeft;
      state.holoTurnccw = holoTurnccw;
    }
  }
});

export const { requestDrive, requestTankDrive, requestHolonomicDrive } = driveSlice.actions;

export default driveSlice.reducer;
