import MotorTelemetry from "./MotorTelemetry";
import "./TelemetryPanel.css";

function TelemetryPanel() {
  return (
    <div className="telemetry-panel">
      <MotorTelemetry />
    </div>
  );
}

export default TelemetryPanel;
