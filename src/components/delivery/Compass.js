import React from "react";
import { useSelector } from "react-redux";
import { selectRoverPosition } from "../../store/telemetrySlice";
import "./Compass.css";

const Compass = () => {
  const { orientW, orientX, orientY, orientZ, posX, posY, posZ } = useSelector(
    selectRoverPosition
  );

  let needleColor;
  let pitch;
  let roll;
  
  if(pitch == null && roll == null) {
    needleColor = "gray";
  } else {

  roll = Math.atan2(2.0*(orientX*orientY + orientW*orientZ), orientW*orientW + orientX*orientX - orientY*orientY - orientZ*orientZ);
  pitch = Math.asin(-2.0*(orientZ*orientZ - orientW*orientY));

  // angle = 2 * acos(c1c2c3 + s1s2s3)
  // c1 = 1 in all cases, since yaw = 0
  // s1s2s3 = 0 in all cases, since yaw = 0
  // math comes from here: https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToAngle/index.htm

  const c2 = Math.cos(pitch / 2);
  const c3 = Math.cos(roll / 2);

  const angle = (2 * Math.acos(c2 * c3) * 180)/Math.PI;

  roll = Math.round(roll*180/Math.PI);
  pitch = Math.round(pitch*180/Math.PI);

  if (Math.abs(angle) < 20) {
    needleColor = "green";
  } else if (Math.abs(angle) < 45) {
    needleColor = "yellow";
  } else {
    needleColor = "red";
  }
}

  const direction = Math.round(
    (Math.atan2(
      2 * (orientW * orientZ + orientX * orientY),
      1 - 2 * (orientY * orientY + orientZ * orientZ)
    ) * 180) / Math.PI
  );
  const latitude = posX;
  const longitude = posY;
  const altitude = posZ;

  return (
    <div className="compass-container">
      <div className="compass">
        <div
          className={`compass__needle compass__needle--${needleColor}`}
          style={{ transform: `rotate(${direction}deg)` }}
        ></div>
        <div className={`compass__outer-ring ${needleColor}`}></div>
        <div className="compass__label compass__label--north">N</div>
        <div className="compass__label compass__label--south">S</div>
        <div className="compass__label compass__label--west">W</div>
        <div className="compass__label compass__label--east">E</div>
      </div>
      <div className="info"> 
        <div>roll: {roll ? roll : "N/A"}</div>
        <div>pitch: {pitch ? pitch : "N/A"}</div>
        <div>latitude: {latitude ? latitude : "N/A"}</div>
        <div>longitude: {longitude ? longitude : "N/A"}</div>   
        <div>altitude: {altitude ? altitude : "N/A"}</div>

      </div>
    </div>
  );
  
};

export default Compass;
