import {combineReducers, configureStore, type MiddlewareAPI} from '@reduxjs/toolkit'
import {cameraSlice} from './cameraSlice.js'
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
import {cameraMiddleware} from './middleware/cameraMiddleware.js'
import {driveMiddleware} from './middleware/driveMiddleware.js'
import {emergencyStopMiddleware} from './middleware/emergencyStopMiddleware.js'
import {inputMiddleware} from './middleware/inputMiddleware.js'
import {jointMiddleware} from './middleware/jointMiddleware.js'
import {motorMiddleware} from './middleware/motorMiddleware.js'
import {opModeMiddleware} from './middleware/opModeMiddleware.js'
import {peripheralMiddleware} from './middleware/peripheralMiddleware.js'
import {roverSocketMiddleware} from './middleware/roverSocketMiddleware.js'
import {servoMiddleware} from './middleware/servoMiddleware.js'
import {telemetryMiddleware} from './middleware/telemetryMiddleware.js'
import {waypointNavMiddleware} from './middleware/waypointNavMiddleware.js'
import {mapSlice} from './mapSlice.js'

const rootReducer = combineReducers({
  camera: cameraSlice.reducer,
  drive: driveSlice.reducer,
  emergencyStop: emergencyStopSlice.reducer,
  input: inputSlice.reducer,
  joint: jointSlice.reducer,
  map: mapSlice.reducer,
  motor: motorSlice.reducer,
  opMode: opModeSlice.reducer,
  peripheral: peripheralSlice.reducer,
  roverSocket: roverSocketSlice.reducer,
  servo: servoSlice.reducer,
  telemetry: telemetrySlice.reducer,
  waypointNav: waypointNavSlice.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      cameraMiddleware,
      driveMiddleware,
      emergencyStopMiddleware,
      inputMiddleware,
      jointMiddleware,
      motorMiddleware,
      opModeMiddleware,
      peripheralMiddleware,
      roverSocketMiddleware,
      servoMiddleware,
      telemetryMiddleware,
      waypointNavMiddleware
    ),
})

export type RootState = ReturnType<typeof rootReducer>
export type RoverDispatch = typeof store.dispatch
export type RoverStoreAPI = MiddlewareAPI<RoverDispatch, RootState>
