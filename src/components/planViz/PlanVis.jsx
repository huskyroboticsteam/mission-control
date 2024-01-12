import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectPlannedPath,
  selectPoseConfidenceEllipse,
  selectLidarPoints
} from "../../store/planVizSlice";
import "./PlanViz.css";

// Pixels per meter.
const SCALE_FACTOR = 10;

/**
 * Component providing autonomous plan visuzliation.
 */
function PlanViz() {
  const canvasRef = useRef();
  const plannedPath = useSelector(selectPlannedPath);
  const poseConfidenceEllipse = useSelector(selectPoseConfidenceEllipse);
  const lidarPoints = useSelector(selectLidarPoints);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);
    context.translate(context.canvas.width / 2, context.canvas.height / 2);
    drawLidarPoints(context, lidarPoints);
    drawPoseConfidenceEllipse(context, poseConfidenceEllipse);
    drawPlannedPath(context, plannedPath);
    drawRover(context);
    context.translate(-context.canvas.width / 2, -context.canvas.height / 2);
    drawCaption(context);
  }, [plannedPath, poseConfidenceEllipse, lidarPoints]);

  return (
    <canvas ref={canvasRef} className="plan-viz" width={600} height={300} />
  );
}

function clear(canvasContext) {
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

function drawLidarPoints(canvasContext, lidarPoints) {
  canvasContext.fillStyle = "#06f";
  lidarPoints.forEach(point => {
    const canvasX = -point.y * SCALE_FACTOR;
    const canvasY = -point.x * SCALE_FACTOR;
    canvasContext.moveTo(canvasX, canvasY);
    canvasContext.beginPath();
    canvasContext.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
    canvasContext.fill();
  });
}

function drawPoseConfidenceEllipse(canvasContext, ellipse) {
  canvasContext.moveTo(ellipse.radiusY * SCALE_FACTOR, 0);
  canvasContext.beginPath();
  canvasContext.ellipse(
    0,
    0,
    ellipse.radiusY * SCALE_FACTOR,
    ellipse.radiusX * SCALE_FACTOR,
    -ellipse.rotation,
    0, 2 * Math.PI
  );
  canvasContext.fillStyle = "#aaaaff33";
  canvasContext.fill();
}

function drawPlannedPath(canvasContext, path) {
  canvasContext.beginPath();
  canvasContext.moveTo(0, 0);

  path.forEach(point => {
    const canvasX = -point.y * SCALE_FACTOR;
    const canvasY = -point.x * SCALE_FACTOR;

    // Draw edge.
    canvasContext.lineTo(canvasX, canvasY);

    // Draw arrow to indicate heading.
    const arrowLength = 10;
    canvasContext.lineTo(
      canvasX + arrowLength * Math.cos(3 * Math.PI / 4 - point.heading),
      canvasY + arrowLength * Math.sin(3 * Math.PI / 4 - point.heading)
    );
    canvasContext.moveTo(canvasX, canvasY);
    canvasContext.lineTo(
      canvasX + arrowLength * Math.cos(1 * Math.PI / 4 - point.heading),
      canvasY + arrowLength * Math.sin(1 * Math.PI / 4 - point.heading)
    );
    canvasContext.moveTo(canvasX, canvasY);
  });

  canvasContext.strokeStyle = "#2f2";
  canvasContext.lineWidth = 3;
  canvasContext.stroke();
}

function drawRover(canvasContext) {
  canvasContext.beginPath();
  canvasContext.moveTo(0, -10);
  canvasContext.lineTo(-5, 0);
  canvasContext.lineTo(-5, 10);
  canvasContext.lineTo(5, 10);
  canvasContext.lineTo(5, 0);
  canvasContext.fillStyle = "white";
  canvasContext.fill();
}

function drawCaption(canvasContext) {
  canvasContext.font = '20px sans-serif';
  canvasContext.fillText("PlanViz", 5, 20);
}

export default PlanViz;
