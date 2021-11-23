import { Fragment } from "react";
import Gamepad from "react-gamepad";

function GamepadControls({ setDriveGamepadConnected, setArmGamepadConnected, userInput, setUserInput }) {
  return (
    <>
      <DriveGamepad setConnected={setDriveGamepadConnected} userInput={userInput} setUserInput={setUserInput} />
      <ArmGamepad setConnected={setArmGamepadConnected} userInput={userInput} setUserInput={setUserInput} />
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
          driveStraight: value
        }
        setUserInput(newUserInput);
        break;
      case "RightStickX":
        newUserInput = {
          ...userInput,
          driveSteer: value,
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
      <Fragment />
    </Gamepad>
  );
}

function ArmGamepad({ setConnected, userInput, setUserInput }) {
  const handleAxisChange = (axisName, value) => {
    let newUserInput;
    switch (axisName) {
      case "LeftStickX":
        newUserInput = {
          ...userInput,
          armBase: value
        }
        setUserInput(newUserInput);
        break;
      case "LeftStickY":
        newUserInput = {
          ...userInput,
          shoulder: value
        }
        setUserInput(newUserInput);
        break;
      case "RightStickY":
        newUserInput = {
          ...userInput,
          elbow: value,
        }
        setUserInput(newUserInput);
        break;
      default:
        break;
    }
  }

  return (
    <Gamepad
      gamepadIndex={1}
      onConnect={() => setConnected(true)}
      onDisconnect={() => setConnected(false)}
      onAxisChange={handleAxisChange}
    >
      {/* For some reason we need to add a child to the gamepad or it crashes. */}
      <Fragment />
    </Gamepad>
  );
}

export default GamepadControls;
