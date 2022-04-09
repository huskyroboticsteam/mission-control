import {
  requestLidPosition,
  requestLazySusanPosition
} from "../scienceSlice";
import {
  messageRover
} from "../roverSocketSlice";

/**
 * Middleware that handles interfacing with the science station.
 */
const scienceMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestLidPosition.type: {
      store.dispatch(messageRover({
        type: "lazySusanLidCloseRequest",
        close: action.payload.closed
      }));
      break;
    }

    case requestLazySusanPosition.type: {
      store.dispatch(messageRover({
            type: "lazySusanPositionRequest",
            position: action.payload.position
      }));
      break;
    }

    //case messageReceivedFromRover.type: {

      //break;
    //}

    default: break;
  }

  return result;
}

export default scienceMiddleware;
