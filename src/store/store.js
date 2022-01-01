import { configureStore } from "@reduxjs/toolkit";
import roverSocketReducer from "./roverSocketSlice";
import emergencyStopReducer from "./emergencyStopSlice";
import opModeReducer from "./opModeSlice";
import inputReducer from "./inputSlice";
import driveReducer from "./driveSlice";
import motorsReducer from "./motorsSlice";
import camerasReducer from './camerasSlice';
import lidarReducer from "./lidarSlice";
import roverSocketMiddleware from "./middleware/roverSocketMiddleware";
import emergencyStopMiddleware from "./middleware/emergencyStopMiddleware";
import opModeMiddleware from "./middleware/opModeMiddleware";
import inputMiddleware from "./middleware/inputMiddleware";
import driveMiddleware from "./middleware/driveMiddleware";
import motorsMiddleware from "./middleware/motorsMiddleware";
import camerasMiddleware from "./middleware/camerasMiddleware";
import lidarMiddleware from "./middleware/lidarMiddleware";

export default configureStore({
  reducer: {
    roverSocket: roverSocketReducer,
    emergencyStop: emergencyStopReducer,
    opMode: opModeReducer,
    input: inputReducer,
    drive: driveReducer,
    motors: motorsReducer,
    cameras: camerasReducer,
    lidar: lidarReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    roverSocketMiddleware,
    emergencyStopMiddleware,
    opModeMiddleware,
    inputMiddleware,
    driveMiddleware,
    motorsMiddleware,
    camerasMiddleware,
    lidarMiddleware
  ])
});
