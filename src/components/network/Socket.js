import React, { useRef, useEffect } from "react";

function Socket({ setRoverConnected, stopEngaged, setStopEngaged, onReceiveMessage, userInput }) {
  const socketRef = useRef(null);

  useEffect(() =>
    connect(socketRef, setRoverConnected, setStopEngaged, onReceiveMessage),
    [setRoverConnected, setStopEngaged, onReceiveMessage]);

  useEffect(() =>
    sendStopCommand(socketRef, stopEngaged),
    [stopEngaged]);

  useEffect(() =>
    sendDriveCommand(socketRef, userInput.driveX, userInput.driveY),
    [userInput.driveX, userInput.driveY]);

  useEffect(() =>
    sendMotorCommand(socketRef, "arm_base", userInput.armBase),
    [userInput.armBase]);

  useEffect(() =>
    sendMotorCommand(socketRef, "shoulder", userInput.shoulder),
    [userInput.shoulder]);

  useEffect(() =>
    sendMotorCommand(socketRef, "elbow", userInput.elbow),
    [userInput.elbow]);

  useEffect(() =>
    sendMotorCommand(socketRef, "forearm", userInput.forearm),
    [userInput.forearm]);

  useEffect(() =>
    sendMotorCommand(socketRef, "diffleft", userInput.diffLeft),
    [userInput.diffLeft]);

  useEffect(() =>
    sendMotorCommand(socketRef, "diffright", userInput.diffRight),
    [userInput.diffRight]);

  useEffect(() =>
    sendMotorCommand(socketRef, "hand", userInput.hand),
    [userInput.hand]);

  // We don't need to render anything.
  return <React.Fragment />;
}

function connect(socketRef, setRoverConnected, setStopEngaged, onReceiveMessage) {
  const socket = new WebSocket("ws://localhost:3001/");
  socket.onopen = () => setRoverConnected(true);
  socket.onmessage = (ev) => onReceiveMessage(JSON.parse(ev.data));
  socket.onclose = () => {
    setRoverConnected(false);
    // The rover will likely be reset when the socket is closed, so disable the
    // emergency stop.
    setStopEngaged(false);
    // Try to reconnect.
    connect(socketRef, setRoverConnected, setStopEngaged, onReceiveMessage);
  }
  socketRef.current = socket;
}

function sendCommand(socketRef, command) {
  console.log(command);
  const socket = socketRef.current;
  if (socket !== null && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(command));
  }
}

function sendStopCommand(socketRef, engageStop) {
  const command = {
    "type": "estop",
    "release": !engageStop
  };
  sendCommand(socketRef, command);
}

function sendDriveCommand(socketRef, driveX, driveY) {
  const command = {
    "type": "drive",
    "forward_backward": driveY,
    "left_right": driveX
  };
  sendCommand(socketRef, command);
}

function sendMotorCommand(socketRef, motorName, power) {
  const command = {
    "type": "motor",
    "motor": motorName,
    "PWM target": power
  };
  sendCommand(socketRef, command);
}

export default Socket;
