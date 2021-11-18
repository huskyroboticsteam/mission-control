import KeyboardControls from "./KeyboardControls";
import GamepadControls from "./GamepadControls";

function InputManager({ setGamepad1Connected, setGamepad2Connected, setUserInput }) {
  return (
    <>
      <KeyboardControls setUserInput={setUserInput} />
      <GamepadControls
        setGamepad1Connected={setGamepad1Connected}
        setGamepad2Connected={setGamepad2Connected}
        setUserInput={setUserInput} />
    </>
  );
}

export default InputManager;
