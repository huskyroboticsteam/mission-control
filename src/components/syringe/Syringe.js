import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSyringePosition } from "../../store/scienceSlice";
import "./Syringe.css";

function Syringe() {
  const canvasRef = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const filling = useSelector(selectSyringePosition);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);

    const rectWidth = Math.floor(width * 2 / 3 / 40) * 40;
    const rectLeft = 70;

    // syringe point 
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(rectLeft - 25, 125);
    context.lineTo(rectLeft, 120);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(rectLeft - 25, 125);
    context.lineTo(rectLeft, 130);
    context.stroke();

    // creates filling #F06292
    context.beginPath();
    context.fillStyle = '#F36397';
    context.fillRect(rectLeft, 100, filling * rectWidth, 50);

    // creates rectangle
    context.beginPath();
    context.strokeStyle = 'white';
    context.strokeRect(rectLeft, 100, rectWidth, 50);

    // longer marks
    for (let i = rectLeft + rectWidth / 6; i < rectLeft + rectWidth; i += rectWidth / 6) {
      context.beginPath();
      context.strokeStyle = 'white';
      if (i === rectWidth / 2 + rectLeft) {
        // middle mark
        context.moveTo(i, 130);
      }
      else {
        context.moveTo(i, 135);
      }
      context.lineTo(i, 150);
      context.stroke();
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        resizeObserver.disconnect();
        setWidth(Math.floor(entry.contentRect.width));
        setHeight(Math.floor(entry.contentRect.height));
        resizeObserver.observe(canvas);
      })
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.unobserve(canvas);
  }, []);


  return (
    <div className="syringe">
      <h2 className="syringe__syringe-name">Syringe</h2>
      <canvas ref={canvasRef} className="syringe" width={width} height={height} />
    </div>
  );
}

function clear(canvasContext) {
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

export default Syringe;