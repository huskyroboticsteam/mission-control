import "./Syringe.css";
import { useRef, useEffect } from "react";

function Syringe () {
    const canvasRef = useRef();

    useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);

    // creates rectangle
    context.beginPath();
    context.strokeStyle = 'white';
    context.strokeRect(100, 100, 400, 50);

    // creates half measurement mark
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(300, 130);
    context.lineTo(300, 150);
    context.stroke();

    // measurement marks in first half
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(140, 135);
    context.lineTo(140, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(180, 135);
    context.lineTo(180, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(220, 135);
    context.lineTo(220, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(260, 135);
    context.lineTo(260, 150);
    context.stroke();

    // measurement marks in second half
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(340, 135);
    context.lineTo(340, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(380, 135);
    context.lineTo(380, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(420, 135);
    context.lineTo(420, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(460, 135);
    context.lineTo(460, 150);
    context.stroke();

    // inbetween lines
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(120, 140);
    context.lineTo(120, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(160, 140);
    context.lineTo(160, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(200, 140);
    context.lineTo(200, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(240, 140);
    context.lineTo(240, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(280, 140);
    context.lineTo(280, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(320, 140);
    context.lineTo(320, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(360, 140);
    context.lineTo(360, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(400, 140);
    context.lineTo(400, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(440, 140);
    context.lineTo(440, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(480, 140);
    context.lineTo(480, 150);
    context.stroke();
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