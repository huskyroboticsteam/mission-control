import { useRef, useEffect, Fragment } from "react";

function Socket({ onConnect, onDisconnect, onReceiveMessage, stopEngaged, userInput }) {
  const socketRef = useRef(null);

  useEffect(() =>
    connect(socketRef, onConnect, onDisconnect, onReceiveMessage),
    []);

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
  return <Fragment />;
}

function connect(socketRef, onConnect, onDisconnect, onReceiveMessage) {
  const socket = new WebSocket("ws://localhost:3001/mission-control");
  socket.onopen = () => onConnect();
  socket.onmessage = (ev) => onReceiveMessage(JSON.parse(ev.data));
  socket.onclose = () => {
    onDisconnect();
    // Try to reconnect.
    connect(socketRef, onConnect, onDisconnect, onReceiveMessage);
  }
  socketRef.current = socket;
}

function sendCommand(socketRef, command) {
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
