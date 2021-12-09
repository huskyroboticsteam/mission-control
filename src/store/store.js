import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./inputSlice";
import roverReducer from "./roverSlice";
import camerasReducer from './camerasSlice';
import roverSocketMiddleware from "./middleware/roverSocketMiddleware";
import inputMiddleware from "./middleware/inputMiddleware";
import camerasMiddleware from "./middleware/camerasMiddleware";

export default configureStore({
  reducer: {
    input: inputReducer,
    rover: roverReducer,
    cameras: camerasReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([roverSocketMiddleware, inputMiddleware, camerasMiddleware])
});
