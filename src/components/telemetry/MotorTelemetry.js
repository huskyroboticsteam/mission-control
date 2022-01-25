import { useSelector } from "react-redux";
import { selectAllMotorNames, selectMotorCurrentPosition, selectMotorCurrentPower, selectMotorCurrentVelocity } from "../../store/motorsSlice";
import camelCaseToTitle from "../../util/camelCaseToTitle";
import "./MotorTelemetry.css";

function MotorTelemetry() {
  const motorNames = useSelector(selectAllMotorNames);

  return (
    <div className="motor-telemetry">
      <table>
        <thead>
          <tr>
              <th>Motor</th>
              <th>Power</th>
              <th>Position (°)</th>
              <th>Velocity (°/s)</th>
            </tr>
          </thead>
        <tbody>
          {motorNames.map(motorName => <MotorData motorName={motorName} key={motorName} />)}
        </tbody>
      </table>
    </div>
  );
}

function MotorData({ motorName }) {
  const power = useSelector(selectMotorCurrentPower(motorName));
  const position = useSelector(selectMotorCurrentPosition(motorName));
  const velocity = useSelector(selectMotorCurrentVelocity(motorName));
  const motorTitle = camelCaseToTitle(motorName);

  return (
    <tr className="motor-telemetry__motor-data">
      <td>{motorTitle}</td>
      <td>{power ? power : "N/A"}</td>
      <td>{position ? Math.round(position) : "N/A"}</td>
      <td>{velocity ? Math.round(velocity) : "N/A"}</td>
    </tr>
  );
}

export default MotorTelemetry;
