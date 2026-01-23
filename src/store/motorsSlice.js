import {createSlice} from '@reduxjs/toolkit'

// When limitSwitchStatus is false, limit switch has not been triggered
// Motor slice contains data for every motor thus the motors are individualy
// assigned limit switch statuses
const initialState = {
  motorsEnabled: false,
  limitSwitches: {  
    armLimitSwitchStatus: false,
    shoulderLimitSwitchStatus: false,
    elbowLimitSwitchStatus: false,
    forearmLimitSwitchStatus: false,
  }
}

const motorSlice = createSlice({
  name: 'motors',
  initialState,
  reducers: {
    enableMotors(state, action) {
      const {enabled} = action.payload
      state.motorsEnabled = enabled
    },
    limitSwitchTriggered(state, action) {
      const {limitSwitchTriggeredName} = action.payload // Should always be true
      switch (limitSwitchTriggeredName) {

        // Different cases as shown in Resurgence/src/world_interface/data.h
        case "armBase":
          state.limitSwitches.armLimitSwitchStatus = true;
          break;
        case "shoulder":
          state.limitSwitches.shoulderLimitSwitchStatus = true;
          break;
        case "elbow":
          state.limitSwitches.elbowLimitSwitchStatus = true;
          break;
        case "forearm":
          state.limitSwitches.forearmLimitSwitchStatus = true;
          break;
      }
    }
  },
})

export const {enableMotors, limitSwitchTriggered} = motorSlice.actions

export const selectMotorsAreEnabled = (state) => state.motors.motorsEnabled
export const selectMotorsLimitSwitches = (state) => state.motors.limitSwitches

export default motorSlice.reducer
