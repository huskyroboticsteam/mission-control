import { useSelector } from "react-redux";
import { selectDriveGamepad, selectPeripheralGamepad } from "../../store/inputSlice";
import "./InputTelemetry.css";

function InputTelemetry() {
  const driveGamepad = useSelector(selectDriveGamepad);
  const peripheralGamepad = useSelector(selectPeripheralGamepad);

  return (
    <div className="input-telemetry">
      <h2>Drive Gamepad</h2>
      <pre>{JSON.stringify(driveGamepad, null, 2)}</pre>
      <h2>Peripheral Gamepad</h2>
      <pre>{JSON.stringify(peripheralGamepad, null, 2)}</pre>
    </div>
  );
}

export default InputTelemetry;
