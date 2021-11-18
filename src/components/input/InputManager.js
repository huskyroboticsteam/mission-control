import KeyboardControls from "./KeyboardControls";
import GamepadControls from "./GamepadControls";

function InputManager({ setDriveGamepadConnected, setArmGamepadConnected, userInput, setUserInput }) {
  return (
    <>
      <KeyboardControls userInput={userInput} setUserInput={setUserInput} />
      <GamepadControls
        setDriveGamepadConnected={setDriveGamepadConnected}
        setArmGamepadConnected={setArmGamepadConnected}
        userInput={userInput}
        setUserInput={setUserInput}
      />
    </>
  );
}

export default InputManager;
