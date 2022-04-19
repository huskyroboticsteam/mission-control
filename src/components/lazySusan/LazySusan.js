//testing
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLazySusanPosition } from "../../store/scienceSlice";
import "./LazySusan.css";

function LazySusan() {
  const canvasRef = useRef();
  const r = 85;
  const add = 300;
  const add_y = 165;

  const position = useSelector(selectLazySusanPosition);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);
    context.beginPath();
    context.ellipse(
      300,
      165,
      50 * 5,
      25 * 5,
      0,
      0, 2 * Math.PI
    );
    context.fillStyle = 'white';
    context.fill();

    context.beginPath();
    context.ellipse(
      2 * (r) + add,
      0 + add_y,
      20 * 3,
      10 * 3,
      0,
      0, 2 * Math.PI
    );
    context.fillStyle = 'grey';
    if (position == 1) {
      context.fillStyle = '#F06292';
    }
    context.fill();

    context.beginPath();
    context.ellipse(
      2 * (0.5 * r) + add,
      0.866 * r + add_y,
      20 * 3,
      10 * 3,
      0,
      0, 2 * Math.PI
    );
    context.fillStyle = 'grey';
    if (position == 2) {
      context.fillStyle = '#F06292';
    }
    context.fill();

    context.beginPath();
    context.ellipse(
      2 * (-0.5 * r) + add,
      0.866 * r + add_y,
      20 * 3,
      10 * 3,
      0,
      0, 2 * Math.PI
    );
    context.fillStyle = 'grey';
    if (position == 3) {
      context.fillStyle = '#F06292';
    }
    context.fill();

    context.beginPath();
    context.ellipse(
      2 * (-1 * r) + add,
      0 + add_y,
      20 * 3,
      10 * 3,
      0,
      0, 2 * Math.PI
    );
    context.fillStyle = 'grey';
    if (position == 4) {
      context.fillStyle = '#F06292';
    }
    context.fill();

    context.beginPath();
    context.ellipse(
      2 * (-0.5 * r) + add,
      -0.866 * r + add_y,
      20 * 3,
      10 * 3,
      0,
      0, 2 * Math.PI
    );
    context.fillStyle = 'grey';
    if (position == 5) {
      context.fillStyle = '#F06292';
    }
    context.fill();

    context.beginPath();
    context.ellipse(
      2 * (0.5 * r) + add,
      -0.866 * r + add_y,
      20 * 3,
      10 * 3,
      0,
      0, 2 * Math.PI
    );
    context.fillStyle = 'grey';
    if (position == 0) {
      context.fillStyle = '#F06292';
    }
    context.fill();
  });



  return (
    <div className="lazy-susan">
      <h2 className="lazy-susan__lazy-susan-name">Lazy Susan</h2>
      <canvas ref={canvasRef} className="lazy-susan" width={600} height={300} />
    </div>

  );
}

function clear(canvasContext) {
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

export default LazySusan;
