import React from "react";
import { useSelector } from "react-redux";
import { selectRoverPosition } from "../../store/telemetrySlice";
import "./Compass.css";
import {Quaternion, Euler, Vector3} from '@math.gl/core';
import * as Quat from 'gl-matrix/quat';

function getAttitude(roll, pitch) {
  let attitudeRPY = new Euler().fromRollPitchYaw(roll, pitch, 0.0);
  // taken from Euler.getQuaternion(), which we can't call because it's broken
  let attitudeQuat = new Quaternion().rotateZ(attitudeRPY.x).rotateX(attitudeRPY.y).rotateY(attitudeRPY.z);
  let attitude = Quat.getAxisAngle(new Vector3(), attitudeQuat);
  return attitude;
}

const Compass = () => {
  const {orientW, orientX, orientY, orientZ, posX, posY, posZ} = useSelector(selectRoverPosition);

  let roll;
  let pitch;
  let yaw;
  let needleColor;

  if (orientW == null || orientX == null || orientY == null || orientZ == null) {
    needleColor = "gray";
  } else {
    let quat = new Quaternion(orientX, orientY, orientZ, orientW);
    let rpy = new Euler().fromQuaternion(quat, Euler.ZYX);
    let attitude = getAttitude(rpy.roll, rpy.pitch);
  
    roll = Math.round(rpy.roll * 180 / Math.PI);
    pitch = Math.round(rpy.pitch * 180 / Math.PI);
    yaw = Math.round(rpy.yaw * 180 / Math.PI);

    if (Math.abs(attitude) < 20) {
      needleColor = "green";
    } else if (Math.abs(attitude) < 45) {
      needleColor = "yellow";
    } else {
      needleColor = "red";
    }
  }

  const longitude = Math.round(posX);
  const latitude = Math.round(posY);
  const altitude = posZ;
  const heading = yaw ? -yaw : undefined; // yaw is CCW, heading is CW

  return (
    <div className="compass-container">
      <div className="compass">
        <div
          className={`compass__needle compass__needle--${needleColor}`}
          style={{ transform: `rotate(${heading ?? 0}deg)` }}
        ></div>
        <div className={`compass__outer-ring ${needleColor}`}></div>
        <div className="compass__label compass__label--north">N</div>
        <div className="compass__label compass__label--south">S</div>
        <div className="compass__label compass__label--west">W</div>
        <div className="compass__label compass__label--east">E</div>
      </div>
      <div className="info">
        <div>roll: {roll ?? "N/A"}</div>
        <div>pitch: {pitch ?? "N/A"}</div>
        <div>heading: {heading ?? "N/A"}</div>
        <div>latitude: {latitude ?? "N/A"}</div>
        <div>longitude: {longitude ?? "N/A"}</div>
        <div>altitude: {altitude ?? "N/A"}</div>
      </div>
    </div>
  );
};

export default Compass;
