import { messageRover } from "../roverSocketSlice";
import { requestWaypointNav } from "../waypointNavSlice";

const waypointNavMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestWaypointNav.type:
      store.dispatch(messageRover({
        message: {
          type: "waypointNavRequest",
          latitude: store.getState().waypointNav.latitude,
          longitude: store.getState().waypointNav.longitude,
          isApproximate: store.getState().waypointNav.isApproximate,
          isGate: store.getState().waypointNav.isGate,
        }
      }));
      break;

    default: break;
  }

  return result;
}

export default waypointNavMiddleware;
