import { useRef, useEffect } from "react";

function Socket({ onConnect, onDisconnect, onReceiveMessage, stopEngaged, userInput }) {
  const socketRef = useRef(null);

  useEffect(() =>
    connect(socketRef, onConnect, onDisconnect, onReceiveMessage),
    []);

  useEffect(() =>
    sendStopCommand(socketRef, stopEngaged),
    [stopEngaged]);

  useEffect(() =>
    sendDriveMessage(socketRef, userInput.driveStraight, userInput.driveSteer),
    [userInput.driveStraight, userInput.driveSteer]);

  useEffect(() =>
    sendMotorPowerMessage(socketRef, "armBase", userInput.armBase),
    [userInput.armBase]);

  useEffect(() =>
    sendMotorPowerMessage(socketRef, "shoulder", userInput.shoulder),
    [userInput.shoulder]);

  useEffect(() =>
    sendMotorPowerMessage(socketRef, "elbow", userInput.elbow),
    [userInput.elbow]);

  // We don't need to render anything.
  return null;
}

function connect(socketRef, onConnect, onDisconnect, onReceiveMessage) {
  const socket = new WebSocket("ws://localhost:3001/mission-control");
  socket.onopen = () => {
    onConnect();
    // Testing the camera stream. Remove this later.
    setTimeout(() => sendCameraStreamOpenRequest(socketRef, "front", 30, 500, 250), 100);
  }
  socket.onmessage = (ev) => onReceiveMessage(JSON.parse(ev.data));
  socket.onclose = () => {
    onDisconnect();
    // Try to reconnect.
    connect(socketRef, onConnect, onDisconnect, onReceiveMessage);
  }
  socketRef.current = socket;
}

function sendMessage(socketRef, message) {
  const socket = socketRef.current;
  if (socket !== null && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

function sendStopCommand(socketRef, stop) {
  const message = {
    type: "emergencyStopRequest",
    stop
  };
  sendMessage(socketRef, message);
}

function sendDriveMessage(socketRef, straight, steer) {
  const message = {
    type: "driveRequest",
    straight,
    steer
  };
  sendMessage(socketRef, message);
}

function sendMotorPowerMessage(socketRef, motor, power) {
  const message = {
    type: "motorPowerRequest",
    motor,
    power
  };
  sendMessage(socketRef, message);
}

function sendCameraStreamOpenRequest(socketRef, camera, fps, width, height) {
  const message = {
    type: "cameraStreamOpenRequest",
    camera,
    fps,
    width,
    height
  }
  sendMessage(socketRef, message);
}

export default Socket;
