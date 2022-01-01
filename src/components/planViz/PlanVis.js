import { useRef, useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { selectLidarPoints } from "../../store/lidarSlice";
import "./PlanViz.css";

// Pixels per meter.
const SCALE_FACTOR = 25;

const lidarPoints0 = [{ x: 1, y: 5 }]
const plannedPath0 = [
  { x: 0, y: 0 },
  { x: 0, y: 5 },
  { x: 3, y: 2 },
  { x: 4.5, y: 3 },
  { x: 7, y: 4 },
  { x: 7.5, y: 7 }
];
const heading0 = 45;

function PlanViz() {
  const canvasRef = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  // const lidarPoints = useSelector(selectLidarPoints);
  const lidarPoints = lidarPoints0;
  // const plannedPath = useSelector(selectPlannedPath);
  const plannedPath = plannedPath0;
  // const heading = useSelector(selectImuHeading);
  const heading = heading0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);
    context.translate(context.canvas.width / 2, context.canvas.height / 2);
    context.rotate(heading * Math.PI / 180);
    drawLidarPoints(context, lidarPoints);
    drawPlannedPath(context, plannedPath);
    drawRover(context, heading);
    context.rotate(-heading * Math.PI / 180);
    context.translate(-context.canvas.width / 2, -context.canvas.height / 2);
    drawCaption(context);
  }, [width, height, lidarPoints, plannedPath, heading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setWidth(Math.floor(entry.contentRect.width));
        setHeight(Math.floor(entry.contentRect.height));
      })
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.unobserve(canvas);
  }, []);

  return (
    <canvas ref={canvasRef} className="plan-viz" width={width} height={height} />
  );
}

function drawCaption(canvasContext) {
  canvasContext.font = '20px sans-serif';
  canvasContext.fillText("PlanViz", 5, 20);
}

function clear(canvasContext) {
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

function drawLidarPoints(canvasContext, lidarPoints) {
  canvasContext.fillStyle = "#06f";
  lidarPoints.forEach(point => {
    canvasContext.moveTo(point.x, -point.y);
    canvasContext.arc(point.x * SCALE_FACTOR, -point.y * SCALE_FACTOR, 3, 0, 2 * Math.PI);
    canvasContext.fill();
  });
}

function drawPlannedPath(canvasContext, path) {
  canvasContext.beginPath();
  // Start at rover in center of canvas.
  canvasContext.moveTo(canvasContext.width / 2, canvasContext.height / 2);
  path.forEach(point => {
    canvasContext.lineTo(point.x * SCALE_FACTOR, -point.y * SCALE_FACTOR);
  });
  canvasContext.strokeStyle = "#2f2";
  canvasContext.lineWidth = 3;
  canvasContext.stroke();
}

function drawRover(canvasContext, heading) {
  canvasContext.beginPath();
  canvasContext.moveTo(0, -10);
  canvasContext.lineTo(-5, 0);
  canvasContext.lineTo(-5, 10);
  canvasContext.lineTo(5, 10);
  canvasContext.lineTo(5, 0);
  canvasContext.fillStyle = "white";
  canvasContext.fill();
}

export default PlanViz;
