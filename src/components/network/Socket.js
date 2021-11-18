import React, { useRef, useEffect } from "react";

function Socket({ setRoverConnected, onReceiveMessage, userInput }) {
  const socketRef = useRef(null);

  useEffect(() => {
    connect(socketRef, setRoverConnected, onReceiveMessage);
  }, [setRoverConnected, onReceiveMessage]);

  useEffect(() =>
    sendDriveCommand(socketRef, userInput.driveX, userInput.driveY),
    [userInput.driveX, userInput.driveY]);

  // We don't need to render anything.
  return <React.Fragment />;
}

function connect(socketRef, setRoverConnected, onReceiveMessage) {
  const socket = new WebSocket("ws://localhost:3001/");
  socket.onopen = () => setRoverConnected(true);
  socket.onmessage = (ev) => {
    onReceiveMessage(JSON.parse(ev.data));
  };
  socket.onclose = () => {
    setRoverConnected(false);
    // Try to reconnect.
    connect(socketRef, setRoverConnected, onReceiveMessage);
  }
  socketRef.current = socket;
}

function sendCommand(socket, command) {
  socket.send(JSON.stringify(command));
}

function sendDriveCommand(socketRef, driveX, driveY) {
  const socket = socketRef.current;
  if (socket !== null && socket.readyState === WebSocket.OPEN) {
    const command = {
      "type": "drive",
      "forward_backward": driveY,
      "left_right": driveX
    };
    sendCommand(socket, command);
  }
}

export default Socket;
