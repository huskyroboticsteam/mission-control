import {configureStore} from '@reduxjs/toolkit'
import roverSocketReducer from './roverSocketSlice'
import peripheralsReducer from './peripheralsSlice'
import emergencyStopReducer from './emergencyStopSlice'
import opModeReducer from './opModeSlice'
import inputReducer from './inputSlice'
import scienceReducer from './scienceSlice'
import driveReducer from './driveSlice'
import jointsReducer from './jointsSlice'
import motorsReducer from './motorsSlice'
import camerasReducer from './camerasSlice'
import telemetryReducer from './telemetrySlice'
import waypointNavReducer from './waypointNavSlice'
import servoReducer from './servoSlice'
import stepperReducer from './stepperSlice'
import navStatusReducer from './navStatusSlice'
import roverSocketMiddleware from './middleware/roverSocketMiddleware'
import peripheralsMiddleware from './middleware/peripheralsMiddleware'
import emergencyStopMiddleware from './middleware/emergencyStopMiddleware'
import opModeMiddleware from './middleware/opModeMiddleware'
import inputMiddleware from './middleware/inputMiddleware'
import scienceMiddleware from './middleware/scienceMiddleware'
import driveMiddleware from './middleware/driveMiddleware'
import jointsMiddleware from './middleware/jointsMiddleware'
import motorsMiddleware from './middleware/motorsMiddleware'
import camerasMiddleware from './middleware/camerasMiddleware'
import telemetryMiddleware from './middleware/telemetryMiddleware'
import waypointNavMiddleware from './middleware/waypointNavMiddleware'
import servoMiddleware from './middleware/servoMiddleware'
import stepperMiddleware from './middleware/stepperMiddleware'
import navStatusMiddleware from './middleware/navStatusMiddleware'

export default configureStore({
  reducer: {
    roverSocket: roverSocketReducer,
    navStatus: navStatusReducer,
    peripherals: peripheralsReducer,
    emergencyStop: emergencyStopReducer,
    opMode: opModeReducer,
    input: inputReducer,
    science: scienceReducer,
    drive: driveReducer,
    joints: jointsReducer,
    motors: motorsReducer,
    cameras: camerasReducer,
    telemetry: telemetryReducer,
    waypointNav: waypointNavReducer,
    servo: servoReducer,
    stepper: stepperReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      roverSocketMiddleware,
      navStatusMiddleware,
      peripheralsMiddleware,
      emergencyStopMiddleware,
      opModeMiddleware,
      inputMiddleware,
      scienceMiddleware,
      driveMiddleware,
      jointsMiddleware,
      motorsMiddleware,
      camerasMiddleware,
      telemetryMiddleware,
      waypointNavMiddleware,
      servoMiddleware,
      stepperMiddleware,
    ]),
})
