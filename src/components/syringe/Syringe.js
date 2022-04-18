import "./Syringe.css";
import { useRef, useEffect } from "react";

function Syringe () {
    const canvasRef = useRef();

    useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);
    context.beginPath();
    context.strokeStyle = 'white';
    context.strokeRect(100, 100, 400, 50);

    });

    

    return (
        <div className="syringe">
          <h2 className="syringe__syringe-name">Syringe</h2>
          <canvas ref={canvasRef} className="syringe" width={600} height={300} />
        </div>
    
      );
    } 

function clear(canvasContext) {
    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

export default Syringe;