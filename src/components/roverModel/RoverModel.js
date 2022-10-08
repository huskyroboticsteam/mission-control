import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import { selectJointCurrentPosition } from "../../store/jointsSlice";
import chassisMesh from "./mesh/chassis.fbx";
import leftSuspensionMesh from "./mesh/leftSuspension.fbx";
import rightSuspensionMesh from "./mesh/rightSuspension.fbx";
import frontLeftWheelMesh from "./mesh/frontLeftWheel.fbx";
import rearLeftWheelMesh from "./mesh/rearLeftWheel.fbx";
import frontRightWheelMesh from "./mesh/frontRightWheel.fbx";
import rearRightWheelMesh from "./mesh/rearRightWheel.fbx";
import armBaseMesh from "./mesh/armBase.fbx";
import lowerArmMesh from "./mesh/lowerArm.fbx";
import upperArmMesh from "./mesh/upperArm.fbx";
import forearmMesh from "./mesh/forearm.fbx";
import differentialMesh from "./mesh/differential.fbx";
import handBaseMesh from "./mesh/handBase.fbx";
import handLeftFingerMesh from "./mesh/handLeftFinger.fbx";
import handRightFingerMesh from "./mesh/handRightFinger.fbx";
import "./RoverModel.css";

function RoverModel() {
  return (
    <Canvas className="arm-model">
      <Suspense fallback={null}>
        <OrbitControls />
        <gridHelper args={[15, 15, "white", "white"]} position={[0, -2.5, 0]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <Rover />
      </Suspense>
    </Canvas>
  );
}

function Rover() {
  const mesh = useFBX(chassisMesh);

  return (
    <primitive
      object={mesh}
      position={[0, -1.95, 0]}
      rotation={[0, Math.PI, 0]}
      scale={[0.025, 0.025, 0.025]}
    >
      <LeftSuspension />
      <RightSuspension />
      <FrontLeftWheel />
      <RearLeftWheel />
      <FrontRightWheel />
      <RearRightWheel />
      <ArmBase />
    </primitive>
  );
}

function LeftSuspension() {
  const mesh = useFBX(leftSuspensionMesh);

  return (
    <primitive
      object={mesh}
      position={[-25, 7.5, 0]}
    />
  )
}

function RightSuspension() {
  const mesh = useFBX(rightSuspensionMesh);

  return (
    <primitive
      object={mesh}
      position={[25, 7.5, 0]}
    />
  )
}

function FrontLeftWheel() {
  const mesh = useFBX(frontLeftWheelMesh);

  return (
    <primitive
      object={mesh}
      position={[-38.5, -5, 32.5]}
    />
  );
}

function RearLeftWheel() {
  const mesh = useFBX(rearLeftWheelMesh);

  return (
    <primitive
      object={mesh}
      position={[-38.5, -5, -32.5]}
    />
  );
}

function FrontRightWheel() {
  const mesh = useFBX(frontRightWheelMesh);

  return (
    <primitive
      object={mesh}
      position={[38.5, -5, 32.5]}
    />
  );
}

function RearRightWheel() {
  const mesh = useFBX(rearRightWheelMesh);

  return (
    <primitive
      object={mesh}
      position={[38.5, -5, -32.5]}
    />
  );
}

function ArmBase() {
  const mesh = useFBX(armBaseMesh);
  const position = useSelector(selectJointCurrentPosition("armBase"));

  return (
    <primitive
      object={mesh}
      position={[0, 15, 30]}
      rotation={[0, -degToRad(position), 0]}
    >
      <LowerArm />
    </primitive>
  );
}

function LowerArm() {
  const mesh = useFBX(lowerArmMesh);
  const position = useSelector(selectJointCurrentPosition("shoulder"));

  return (
    <primitive
      object={mesh}
      position={[0, 12, 0]}
      rotation={[-degToRad(position), 0, 0]}
    >
      <UpperArm />
    </primitive>
  );
}

function UpperArm() {
  const mesh = useFBX(upperArmMesh);
  const position = useSelector(selectJointCurrentPosition("elbow"));

  return (
    <primitive
      object={mesh}
      position={[0, 60, -56]}
      rotation={[-degToRad(position), 0, 0]}
    >
      <Forearm />
    </primitive>
  );
}

function Forearm() {
  const mesh = useFBX(forearmMesh);
  const position = useSelector(selectJointCurrentPosition("forearm"));

  return (
    <primitive
      object={mesh}
      position={[0, 4, 95]}
      rotation={[0, 0, degToRad(position)]}
    >
      <Differential />
    </primitive>
  );
}

function Differential() {
  const mesh = useFBX(differentialMesh);
  const differentialPitch = useSelector(selectJointCurrentPosition("differentialPitch"));
  const differentialRoll = useSelector(selectJointCurrentPosition("differentialRoll"));

  return (
    <primitive
      object={mesh}
      position={[0, 0, 12.5]}
      rotation={[degToRad(differentialPitch), 0, degToRad(differentialRoll)]}
    >
      <Hand />
    </primitive>
  );
}

function Hand() {
  const baseMesh = useFBX(handBaseMesh);
  const leftMesh = useFBX(handLeftFingerMesh);
  const rightMesh = useFBX(handRightFingerMesh);
  const position = useSelector(selectJointCurrentPosition("hand"));

  return (
    <primitive
      object={baseMesh}
      position={[0, 0, 21.5]}
    >
      <primitive
        object={leftMesh}
        position={[4, 0, 2]}
        rotation={[0, degToRad(position), 0]}
      />
      <primitive
        object={rightMesh}
        position={[-4, 0, 2]}
        rotation={[0, degToRad(-position), 0]}
      />
    </primitive>
  );
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}

export default RoverModel;
