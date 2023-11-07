import { configureStore } from "@reduxjs/toolkit";
import roverSocketReducer from "./roverSocketSlice";
import peripheralsReducer from "./peripheralsSlice";
import emergencyStopReducer from "./emergencyStopSlice";
import opModeReducer from "./opModeSlice";
import inputReducer from "./inputSlice";
import driveReducer from "./driveSlice";
import jointsReducer from "./jointsSlice";
import motorsReducer from "./motorsSlice";
import camerasReducer from './camerasSlice';
import loggingReducer from "./loggingSlice";
import telemetryReducer from "./telemetrySlice";
import roverSocketMiddleware from "./middleware/roverSocketMiddleware";
import peripheralsMiddleware from "./middleware/peripheralsMiddleware";
import emergencyStopMiddleware from "./middleware/emergencyStopMiddleware";
import opModeMiddleware from "./middleware/opModeMiddleware";
import inputMiddleware from "./middleware/inputMiddleware";
import driveMiddleware from "./middleware/driveMiddleware";
import jointsMiddleware from "./middleware/jointsMiddleware";
import motorsMiddleware from "./middleware/motorsMiddleware";
import camerasMiddleware from "./middleware/camerasMiddleware";
import loggingMiddleware from "./middleware/loggingMiddleware";
import telemetryMiddleware from "./middleware/telemetryMiddleware";

export default configureStore({
  reducer: {
    roverSocket: roverSocketReducer,
    peripherals: peripheralsReducer,
    emergencyStop: emergencyStopReducer,
    opMode: opModeReducer,
    input: inputReducer,
    drive: driveReducer,
    joints: jointsReducer,
    motors: motorsReducer,
    cameras: camerasReducer,
    logging: loggingReducer,
    telemetry: telemetryReducer
  },

  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    roverSocketMiddleware,
    peripheralsMiddleware,
    emergencyStopMiddleware,
    opModeMiddleware,
    inputMiddleware,
    driveMiddleware,
    jointsMiddleware,
    motorsMiddleware,
    camerasMiddleware,
    loggingMiddleware,
    telemetryMiddleware
  ])
});
