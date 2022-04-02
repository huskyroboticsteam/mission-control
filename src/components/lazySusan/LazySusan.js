import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import "./LazySusan.css";

function LazySusan() {
    const canvasRef = useRef();

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
        context.strokeStyle = 'white';
        context.stroke();
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
