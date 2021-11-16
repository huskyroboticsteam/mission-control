import { useEffect } from "react";

function Socket() {
  useEffect(connect, []);
  return <></>;
}

function connect() {
  const socket = new WebSocket("ws://localhost:3001/");
  socket.onerror = () => console.log("Connection failed");
  socket.onopen = () => console.log("Connected");
}

export default Socket;
