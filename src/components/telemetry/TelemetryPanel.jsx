import JointTelemetry from './JointTelemetry'
import InputTelemetry from './InputTelemetry'
import './TelemetryPanel.css'

function TelemetryPanel() {
  return (
    <div className="telemetry-panel">
      <InputTelemetry />
      <JointTelemetry />
    </div>
  )
}

export default TelemetryPanel
