import { roverConnected, messageRover } from "../roverSocketSlice";
import { requestWaypointNav } from "../waypointNavSlice";

const waypointNavMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestWaypointNav.type:
    case roverConnected.type: {
      store.dispatch(messageRover({
        message: {
          type: "waypointNavRequest",
          latitude: store.getState().waypointNav.latitude,
          longitude: store.getState().waypointNav.longitude,
          approximate: store.getState().waypointNav.approximate,
          gated: store.getState().waypointNav.gated,
        }
      }));
      break;
    }

    default: break;
  }

  return result;
}

export default waypointNavMiddleware;
