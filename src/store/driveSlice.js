import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  straight: 0,
  crab: 0,
  steer: 0,
  tankLeft: 0,
  tankRight: 0
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

    requestTurnInPlaceDrive(state, action) {
      const { steer } = action.payload;
      state.steer = steer;
    },

    requestCrabDrive(state, action) {
      const { crab, steer } = action.payload;
      state.crab = crab;
      state.steer = steer;
    }
  }
});

export const { requestDrive, requestTankDrive, requestTurnInPlaceDrive, requestCrabDrive } = driveSlice.actions;

export default driveSlice.reducer;
