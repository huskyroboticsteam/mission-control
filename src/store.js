import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./features/inputSlice";
import roverReducer from "./features/roverSlice";
import roverSocketMiddleware from "./middleware/roverSocket";

export default configureStore({
  reducer: {
    input: inputReducer,
    rover: roverReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(roverSocketMiddleware)
});
