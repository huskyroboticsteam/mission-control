import {
  connectToRover,
  disconnectFromRover,
  emergencyStopRequested,
  roverConnected,
  roverDisconnected
} from "../features/roverSlice";

const roverSocketMiddleware = () => {
  let socket = null;

  const onOpen = store => () => {
    store.dispatch(roverConnected());
  };

  const onClose = store => () => {
    store.dispatch(roverDisconnected());
    socket = null;
  };

  const onMessage = store => event => {
    const message = JSON.parse(event.data);
    // TODO
  };

  const sendMessage = message => {
    if (socket && socket.readyState === WebSocket.OPEN)
      socket.send(JSON.stringify(message));
  }

  return store => next => action => {
    const prevState = store.getState();
    // Allow the store to update before messaging the rover.
    next(action);
    const newState = store.getState();

    if (action.type === connectToRover.type) {
      if (socket && socket.readyState !== WebSocket.CLOSED) socket.close();
      socket = new WebSocket(action.payload.url);
      socket.onmessage = onMessage(store);
      socket.onclose = onClose(store);
      socket.onopen = onOpen(store);
    } else if (action.type === disconnectFromRover.type) {
      if (socket && socket.readyState !== WebSocket.closed) {
        socket.close();
      }
    } else if (action.type === emergencyStopRequested.type) {
      const { stop } = action.payload;
      sendMessage({ type: "emergencyStopRequest", stop })
    } else if (action.type.startsWith("input/")) {
      // The computed input may have been updated.
    }
  };
};

export default roverSocketMiddleware();
