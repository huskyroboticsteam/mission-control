import MotorTelemetry from "./MotorTelemetry";
import InputTelemetry from "./InputTelemetry";
import "./TelemetryPanel.css";

function TelemetryPanel() {
  return (
    <div className="telemetry-panel">
      <InputTelemetry />
      <MotorTelemetry />
    </div>
  );
}

export default TelemetryPanel;
