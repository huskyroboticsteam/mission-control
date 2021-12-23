import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import { selectReportedMotorPosition } from "../../store/motorsSlice";
import armBaseMesh from "./armBase.fbx";
import lowerArmMesh from "./lowerArm.fbx";
import upperArmMesh from "./upperArm.fbx";
import "./ArmModel.css";

function ArmModel() {
  const armBasePosition = useSelector(selectReportedMotorPosition("armBase"));
  const shoulderPosition = useSelector(selectReportedMotorPosition("shoulder"));
  const elbowPosition = useSelector(selectReportedMotorPosition("elbow"));

  return (
    <Canvas className="arm-model">
      <Suspense fallback={null}>
        <OrbitControls />
        <gridHelper args={[15, 15, "white", "gray"]} position={[0, -2, 0]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <ArmBase
          armBasePosition={armBasePosition}
          shoulderPosition={shoulderPosition}
          elbowPosition={elbowPosition}
        />
      </Suspense>
    </Canvas>
  );
}

function ArmBase({ armBasePosition, shoulderPosition, elbowPosition }) {
  const mesh = useFBX(armBaseMesh);

  return (
    <primitive
      object={mesh}
      position={[0, -2, 0]}
      rotation={[0, Math.PI / 4 - degToRad(armBasePosition), 0]}
      scale={[1.5, 1.5, 1.5]}
    >
      <LowerArm
        shoulderPosition={shoulderPosition}
        elbowPosition={elbowPosition}
      />
    </primitive>
  );
}

function LowerArm({ shoulderPosition, elbowPosition }) {
  const mesh = useFBX(lowerArmMesh);

  return (
    <primitive
      object={mesh}
      position={[0, 0.3, 0]}
      rotation={[degToRad(shoulderPosition), 0, 0]}
    >
      <UpperArm elbowPosition={elbowPosition} />
    </primitive>
  );
}

function UpperArm({ elbowPosition }) {
  const mesh = useFBX(upperArmMesh);

  return (
    <primitive
      object={mesh}
      position={[0, 1.7, 1.25]}
      rotation={[degToRad(elbowPosition), 0, 0]}
    />
  );
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}

export default ArmModel;
