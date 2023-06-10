import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX, Cylinder, Box } from "@react-three/drei";
import { selectJointCurrentPosition } from "../../store/jointsSlice";
import chassisMesh from "./mesh/chassis.fbx";
import leftSuspensionMesh from "./mesh/leftSuspension.fbx";
import rightSuspensionMesh from "./mesh/rightSuspension.fbx";
import frontLeftWheelMesh from "./mesh/frontLeftWheel.fbx";
import rearLeftWheelMesh from "./mesh/rearLeftWheel.fbx";
import frontRightWheelMesh from "./mesh/frontRightWheel.fbx";
import rearRightWheelMesh from "./mesh/rearRightWheel.fbx";
import armBaseMesh from "./mesh/armBase.fbx";
import forearmMesh from "./mesh/forearm.fbx";
import wristMesh from "./mesh/wrist.fbx";
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
      rotation={[0, degToRad(position), 0]}
    >
      <LowerArm position={[0, 10, 0]} />
    </primitive>
  );
}

function LowerArm({position}) {
  const jointPos = useSelector(selectJointCurrentPosition("shoulder"));
  const length = 39;

  return (
    <group
      position={position}
      rotation={[-degToRad(jointPos), 0, 0]}
    >
      <ArmSegment length={length} />
      <UpperArm position={[0, 0, length]} />
    </group>
  );
}

function UpperArm({position}) {
  const jointPos = useSelector(selectJointCurrentPosition("elbow"));
  const length = 43;

  return (
    <group
      position={position}
      rotation={[-degToRad(jointPos), 0, 0]}
    >
      <ArmSegment length={length} />
      <Forearm position={[0, 0, length]} />
    </group>
  );
}

function Forearm({position}) {
  const mesh = useFBX(forearmMesh);
  const jointPos = useSelector(selectJointCurrentPosition("forearm"));

  return (
    <primitive
      object={mesh}
      position={position}
      rotation={[0, 0, degToRad(jointPos)]}
    >
      <Wrist />
    </primitive>
  );
}

function Wrist() {
  const mesh = useFBX(wristMesh);
  const position = useSelector(selectJointCurrentPosition("wrist"));

  return (
    <primitive
      object={mesh}
      position={[0, 0, 12.5]}
      rotation={[degToRad(-position), 0, 0]}
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

function ArmSegment({length}) {
  return <>
    <Box args={[6, 6, length]}
      position={[0, 0, length/2]}
      material-color="#6C6C76" />
    <Cylinder args={[5, 5, 5, 20]}
      position={[0, 0, length]}
      rotation={[0, 0, Math.PI / 2]}
      material-color="#6C6C76" />
  </>;
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}

export default RoverModel;
