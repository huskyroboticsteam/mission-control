import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import { selectLidarPoints } from "../../store/lidarSlice";
import "./PlanViz.css";

function PlanViz() {
  const lidarPoints = useSelector(selectLidarPoints);

  return (
    <Canvas className="plan-viz">
      <OrbitControls />
      <gridHelper args={[50, 50, "white", "gray"]} position={[0, -2, 0]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <LidarViz lidarPoints={lidarPoints} />
    </Canvas>
  );
}

function LidarViz({ lidarPoints }) {
  return (
    <mesh position={[0, -2, 0]}>
      {lidarPoints.map((lidarPoint, index) => (
        <mesh position={lidarPoint} key={index}>
          <sphereGeometry attach="geometry" args={[0.1, 16, 16]} />
          <meshStandardMaterial
            attach="material"
            color="white"
          />
        </mesh>
      ))}
    </mesh>
  );
}

export default PlanViz;
