import JointTelemetry from "./JointTelemetry";
import InputTelemetry from "./InputTelemetry";
import MessageLog from "./MessageLog";
import "./TelemetryPanel.css";

function TelemetryPanel() {
  return (
    <div className="telemetry-panel">
      <InputTelemetry />
      <JointTelemetry />
      <MessageLog />
    </div>
  );
}

export default TelemetryPanel;
