import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import { selectMotorCurrentPosition } from "../../store/motorsSlice";
import armBaseMesh from "./armBase.fbx";
import lowerArmMesh from "./lowerArm.fbx";
import upperArmMesh from "./upperArm.fbx";
import forearmMesh from "./forearm.fbx";
import differentialMesh from "./differential.fbx";
import handBaseMesh from "./handBase.fbx";
import handLeftFingerMesh from "./handLeftFinger.fbx";
import handRightFingerMesh from "./handRightFinger.fbx";
import "./ArmModel.css";

function ArmModel() {
  // Selectors don't work in child components with React Three Fiber, so we
  // must prop drill unfortunately.
  const armBasePosition = useSelector(selectMotorCurrentPosition("armBase"));
  const shoulderPosition = useSelector(selectMotorCurrentPosition("shoulder"));
  const elbowPosition = useSelector(selectMotorCurrentPosition("elbow"));
  const forearmPosition = useSelector(selectMotorCurrentPosition("forearm"));
  const differentialLeftPosition = useSelector(selectMotorCurrentPosition("differentialLeft"));
  const differentialRightPosition = useSelector(selectMotorCurrentPosition("differentialRight"));
  const handPosition = useSelector(selectMotorCurrentPosition("hand"));

  return (
    <Canvas className="arm-model">
      <Suspense fallback={null}>
        <OrbitControls />
        <gridHelper args={[15, 15, "white", "white"]} position={[0, -2.5, 0]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <ArmBase
          armBasePosition={armBasePosition}
          shoulderPosition={shoulderPosition}
          elbowPosition={elbowPosition}
          forearmPosition={forearmPosition}
          differentialLeftPosition={differentialLeftPosition}
          differentialRightPosition={differentialRightPosition}
          handPosition={handPosition}
        />
      </Suspense>
    </Canvas>
  );
}

function ArmBase({
  armBasePosition,
  shoulderPosition,
  elbowPosition,
  forearmPosition,
  differentialLeftPosition,
  differentialRightPosition,
  handPosition
}) {
  const mesh = useFBX(armBaseMesh);

  return (
    <primitive
      object={mesh}
      position={[0, -2.5, 0]}
      rotation={[0, Math.PI - degToRad(armBasePosition), 0]}
      scale={[0.035, 0.035, 0.035]}
    >
      <LowerArm
        shoulderPosition={shoulderPosition}
        elbowPosition={elbowPosition}
        forearmPosition={forearmPosition}
        differentialLeftPosition={differentialLeftPosition}
        differentialRightPosition={differentialRightPosition}
        handPosition={handPosition}
      />
    </primitive>
  );
}

function LowerArm({
  shoulderPosition,
  elbowPosition,
  forearmPosition,
  differentialLeftPosition,
  differentialRightPosition,
  handPosition
}) {
  const mesh = useFBX(lowerArmMesh);

  return (
    <primitive
      object={mesh}
      position={[0, 12, 0]}
      rotation={[degToRad(shoulderPosition), 0, 0]}
    >
      <UpperArm
        elbowPosition={elbowPosition}
        forearmPosition={forearmPosition}
        differentialLeftPosition={differentialLeftPosition}
        differentialRightPosition={differentialRightPosition}
        handPosition={handPosition}
      />
    </primitive>
  );
}

function UpperArm({
  elbowPosition,
  forearmPosition,
  differentialLeftPosition,
  differentialRightPosition,
  handPosition
}) {
  const mesh = useFBX(upperArmMesh);

  return (
    <primitive
      object={mesh}
      position={[0, 60, -56]}
      rotation={[degToRad(elbowPosition), 0, 0]}
    >
      <Forearm
        forearmPosition={forearmPosition}
        differentialLeftPosition={differentialLeftPosition}
        differentialRightPosition={differentialRightPosition}
        handPosition={handPosition}
      />
    </primitive>
  );
}

function Forearm({
  forearmPosition,
  differentialLeftPosition,
  differentialRightPosition,
  handPosition
}) {
  const mesh = useFBX(forearmMesh);

  return (
    <primitive
      object={mesh}
      position={[0, 4, 95]}
      rotation={[0, 0, -degToRad(forearmPosition)]}
    >
      <Differential
        differentialLeftPosition={differentialLeftPosition}
        differentialRightPosition={differentialRightPosition}
        handPosition={handPosition}
      />
    </primitive>
  );
}

function Differential({
  differentialLeftPosition,
  differentialRightPosition,
  handPosition
}) {
  const mesh = useFBX(differentialMesh);
  const pitch = (differentialRightPosition + differentialLeftPosition) / 2;
  const roll = differentialLeftPosition - differentialRightPosition;

  return (
    <primitive
      object={mesh}
      position={[0, 0, 12.5]}
      rotation={[degToRad(pitch), 0, degToRad(roll)]}
    >
      <Hand
        handPosition={handPosition}
      />
    </primitive>
  );
}

function Hand({ handPosition }) {
  const baseMesh = useFBX(handBaseMesh);
  const leftMesh = useFBX(handLeftFingerMesh);
  const rightMesh = useFBX(handRightFingerMesh);

  return (
    <primitive
      object={baseMesh}
      position={[0, 0, 21.5]}
    >
      <primitive
        object={leftMesh}
        position={[4, 0, 2]}
        rotation={[0, degToRad(-handPosition), 0]}
      />
      <primitive
        object={rightMesh}
        position={[-4, 0, 2]}
        rotation={[0, degToRad(handPosition), 0]}
      />
    </primitive>
  );
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}

export default ArmModel;
