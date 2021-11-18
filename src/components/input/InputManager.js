import KeyboardControls from "./KeyboardControls";
import GamepadControls from "./GamepadControls";

function InputManager({ setGamepad1Connected, setGamepad2Connected, userInput, setUserInput }) {
  return (
    <>
      <KeyboardControls userInput={userInput} setUserInput={setUserInput} />
      <GamepadControls
        setGamepad1Connected={setGamepad1Connected}
        setGamepad2Connected={setGamepad2Connected}
        userInput={userInput}
        setUserInput={setUserInput} />
    </>
  );
}

export default InputManager;
