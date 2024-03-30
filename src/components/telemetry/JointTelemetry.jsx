import { useSelector } from "react-redux";
import { useState } from "react";
import {
  selectJointCurrentPosition,
  selectAllJointNames,
} from "../../store/jointsSlice";
import { selectMotorCurrentLimits } from "../../store/motorsSlice";

import camelCaseToTitle from "../../util/camelCaseToTitle";
import "./JointTelemetry.css";

function JointTelemetry() {
  const jointNames = useSelector(selectAllJointNames);

  return (
    <div className="motor-telemetry">
      <table>
        <thead>
          <tr>
            <th>Joint</th>
            <th>Position</th>
            <th>Limits</th>
          </tr>
        </thead>
        <tbody>
          {jointNames.map(motorName => <MotorData motorName={motorName} key={motorName} />)}
        </tbody>
      </table>
    </div>
  );
}

function MotorData({ motorName }) {
  const position = useSelector(selectJointCurrentPosition(motorName));
  const limits = selectMotorCurrentLimits(motorName);
  const motorTitle = camelCaseToTitle(motorName);

  return (
    <tr className="motor-telemetry__motor-data">
      <td>{motorTitle}</td>
      <td>{position != null ? `${Math.round(position)}°` : "N/A"}</td>
      {limits != null ? <LimitDisplay limits={limits}/> : "N/A"}
    </tr>
  );
}

function LimitDisplay({ limits }) {
  const [limitColor, setLimitColor] = useState("#606060");
  const changeColor = (color) => setLimitColor(color);

  // return (
  //   <div id="divLimit">
  //     <svg height="40" width="170">
  //       {/* <polygon points={`0,0 0,${height} ${width},0`} fill={limits >> 1 & 0b1 ? "#FF0000" : "#FFFFFF"} />
  //       <polygon points={`0,${height} ${width},${height} ${width},0`} fill={limits & 0b1 ? "#FF0000" : "#FFFFFF"} /> */}
  //       <polygon points={'0,0 0,40 100,0'} fill="#FFFFFF" />
  //     </svg>
  //   </div>
  // );

  return (
    <td>
      <button id="upper" color={limitColor} onClick={() => changeColor(limits >> 1 & 0b1 ? "#FFFFFF" : "#00000000")}>^</button>
      <button id="lower" color={limitColor} onClick={() => changeColor(limits & 0b1 ? "#FFFFFF" : "#00000000")}>v</button>
    </td>
  );
}

export default JointTelemetry;
