import { ROVER_SERVER_URL } from "../../constants/networkConstants";
import {
  connectToRover,
  disconnectFromRover,
  roverConnected,
  roverDisconnected,
  messageRover,
  messageReceivedFromRover
} from "../roverSlice";

/**
 * Middleware that handles connecting to, disconnecting from, and messaging the
 * rover when related actions are dispatched.
 */
const roverSocketMiddleware = () => {
  let socket = null;

  const onOpen = store => () => store.dispatch(roverConnected());

  const onClose = store => () => {
    socket = null;
    store.dispatch(roverDisconnected());
    // After the initial connection is made, we should automatically try to
    // reconnect on disconnect.
    store.dispatch(connectToRover());
  };

  const onMessage = store => event => {
    const message = JSON.parse(event.data);
    store.dispatch(messageReceivedFromRover({ message }));
  };

  return store => next => action => {
    next(action);

    switch (action.type) {
      case connectToRover.type:
        if (socket && socket.readyState !== WebSocket.CLOSED)
          socket.close();
        socket = new WebSocket(ROVER_SERVER_URL);
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);
        break;

      case disconnectFromRover.type:
        if (socket && socket.readyState !== WebSocket.closed)
          socket.close();
        break;

      case messageRover.type:
        if (socket && socket.readyState === WebSocket.OPEN)
          socket.send(JSON.stringify(action.payload.message));
        break;

      default:
        break;
    }
  };
};

export default roverSocketMiddleware();
