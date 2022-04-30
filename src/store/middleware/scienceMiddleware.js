import {
  requestLidPosition,
  requestLazySusanPosition,
  requestSyringePosition
} from "../scienceSlice";
import {
  messageRover,
  messageReceivedFromRover
} from "../roverSocketSlice";

/**
 * Middleware that handles interfacing with the science station.
 */
const scienceMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestLidPosition.type: {
      store.dispatch(messageRover({
        message: {
          type: "lazySusanLidCloseRequest",
          close: action.payload.closed
        }
      }));
      break;
    }

    case requestLazySusanPosition.type: {
      store.dispatch(messageRover({
        message: {
          type: "lazySusanPositionRequest",
          position: action.payload.position
        }
      }));
      break;
    }

    case requestSyringePosition.type: {
      store.dispatch(messageRover({
        message: {
          type: "syringeDepthRequest",
          depth: action.payload.depth
        }
      }));
      break;
    }

    case messageReceivedFromRover.type: {
      // TODO: Handle science station messages.
      break;
    }

    default: break;
  }

  return result;
}

export default scienceMiddleware;
