import {configureStore} from '@reduxjs/toolkit'
import {camerasSlice} from './cameraSlice.js'
import {driveSlice} from './driveSlice.js'
import {emergencyStopSlice} from './emergencyStopSlice.js'
import {inputSlice} from './inputSlice.js'
import {jointSlice} from './jointSlice.js'
import {motorSlice} from './motorSlice.js'
import {opModeSlice} from './opModeSlice.js'
import {peripheralSlice} from './peripheralSlice.js'
import {roverSocketSlice} from './roverSocketSlice.js'
import {servoSlice} from './servoSlice.js'
import {telemetrySlice} from './telemetrySlice.js'
import {waypointNavSlice} from './waypointNavSlice.js'
import {roverSocketMiddleware} from './middleware/roverSocketMiddleware.js'

export const store = configureStore({
  reducer: {
    camera: camerasSlice.reducer,
    drive: driveSlice.reducer,
    emergencyStop: emergencyStopSlice.reducer,
    input: inputSlice.reducer,
    joint: jointSlice.reducer,
    motor: motorSlice.reducer,
    opMode: opModeSlice.reducer,
    peripheral: peripheralSlice.reducer,
    roverSocket: roverSocketSlice.reducer,
    servo: servoSlice.reducer,
    telemetry: telemetrySlice.reducer,
    waypointNav: waypointNavSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(roverSocketMiddleware).concat(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
