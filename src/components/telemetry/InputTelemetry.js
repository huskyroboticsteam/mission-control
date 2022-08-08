import { useSelector } from "react-redux";
import { selectDriveGamepad, selectPeripheralGamepad } from "../../store/inputSlice";
import "./InputTelemetry.css";

function InputTelemetry() {
  const driveGamepad = useSelector(selectDriveGamepad);
  const peripheralGamepad = useSelector(selectPeripheralGamepad);
  const replacer = (key, value) => {
    const exclude = ["LS", "RS", "Start", "Back", "isConnected"];
    if (exclude.includes(key)) return undefined;
    else return value;
  }

  return (
    <div className="input-telemetry">
      <h2>Drive Gamepad</h2>
      <pre>{JSON.stringify(driveGamepad, replacer, 2)}</pre>
      <h2>Peripheral Gamepad</h2>
      <pre>{JSON.stringify(peripheralGamepad, replacer, 2)}</pre>
    </div>
  );
}

export default InputTelemetry;
