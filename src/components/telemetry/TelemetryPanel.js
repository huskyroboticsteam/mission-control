import { useSelector } from "react-redux";
import { selectMotorCurrentPosition, selectMotorCurrentPower, selectMotorCurrentVelocity } from "../../store/motorsSlice";
import camelCaseToTitle from "../../util/camelCaseToTitle";
import "./TelemetryPanel.css";

const motorNames = [
  "frontLeftWheel",
  "frontRightWheel",
  "rearLeftWheel",
  "rearRightWheel",
  "armBase",
  "shoulder",
  "elbow"
];

function TelemetryPanel() {
  return (
    <div className="telemetry-panel">
      {motorNames.map(motorName => <MotorTelemetry motorName={motorName} key={motorName} />)}
    </div>
  );
}

function MotorTelemetry({ motorName }) {
  const power = useSelector(selectMotorCurrentPower(motorName));
  const position = useSelector(selectMotorCurrentPosition(motorName));
  const velocity = useSelector(selectMotorCurrentVelocity(motorName));
  const motorTitle = camelCaseToTitle(motorName);

  return (
    <div className="telemetry-panel__motor">
      {motorTitle} power: {Math.round(power)} position: {Math.round(position)} deg velocity: {Math.round(velocity)} deg/s
    </div>
  );
}

export default TelemetryPanel;
