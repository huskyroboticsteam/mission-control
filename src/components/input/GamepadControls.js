import Gamepad from "react-gamepad";

function GamepadControls({ setGamepad1Connected, setGamepad2Connected }) {
  return (
    <>
      <Gamepad1 setConnected={setGamepad1Connected} />
      <Gamepad2 setConnected={setGamepad2Connected} />
    </>
  );
}

function Gamepad1({ setConnected }) {
  return (
    <Gamepad
      gamepadIndex={0}
      onConnect={() => setConnected(true)}
      onDisconnect={() => setConnected(false)}
    >
      {/* For some reason we need to add a child to the gamepad or it crashes. */}
      <></>
    </Gamepad>
  );
}

function Gamepad2({ setConnected }) {
  return (
    <Gamepad
      gamepadIndex={1}
      onConnect={() => setConnected(true)}
      onDisconnect={() => setConnected(false)}
    >
      {/* For some reason we need to add a child to the gamepad or it crashes. */}
      <></>
    </Gamepad>
  );
}

export default GamepadControls;
