import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSyringePosition} from "../../store/scienceSlice";
import "./Syringe.css";

function Syringe () {
    const canvasRef = useRef();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const filling = useSelector(selectSyringePosition);
    console.log("INCREMENTING SYRINGE - js 1", filling);

    useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);
    
    const rect_width = Math.floor(width*2/3/40)*40;
    const rect_left  = 70;

    // syringe point 
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(rect_left - 25, 125);
    context.lineTo(rect_left, 120);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(rect_left - 25, 125);
    context.lineTo(rect_left, 130);
    context.stroke();

    // creates filling #F06292
    context.beginPath();
    context.fillStyle = '#F36397';
    context.fillRect(rect_left, 100, filling*rect_width, 50);
    console.log("INCREMENTING SYRINGE - js 2", filling);

    // creates rectangle
    context.beginPath();
    context.strokeStyle = 'white';
    context.strokeRect(rect_left, 100, rect_width, 50);

    // longer marks
    for(let i = rect_left + rect_width/6; i < rect_left + rect_width; i += rect_width/6) {
      context.beginPath();
      context.strokeStyle = 'white';
      if(i == rect_width/2 + rect_left) {
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