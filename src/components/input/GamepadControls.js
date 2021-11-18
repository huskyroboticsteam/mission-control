import Gamepad from "react-gamepad";

function GamepadControls({ setGamepad1Connected, setGamepad2Connected, userInput, setUserInput }) {
  return (
    <>
      <DriveGamepad setConnected={setGamepad1Connected} userInput={userInput} setUserInput={setUserInput} />
      <ArmGamepad setConnected={setGamepad2Connected} userInput={userInput} setUserInput={setUserInput} />
    </>
  );
}

function DriveGamepad({ setConnected, userInput, setUserInput }) {
  const handleAxisChange = (axisName, value) => {
    let newUserInput;
    switch (axisName) {
      case "LeftStickY":
        newUserInput = {
          ...userInput,
          driveY: value
        }
        setUserInput(newUserInput);
        break;
      case "RightStickX":
        newUserInput = {
          ...userInput,
          driveX: -value,
        }
        setUserInput(newUserInput);
        break;
      default:
        break;
    }
  }

  return (
    <Gamepad
      gamepadIndex={0}
      onConnect={() => setConnected(true)}
      onDisconnect={() => setConnected(false)}
      onAxisChange={handleAxisChange}
    >
      {/* For some reason we need to add a child to the gamepad or it crashes. */}
      <></>
    </Gamepad>
  );
}

function ArmGamepad({ setConnected, userInput, setUserInput }) {
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
