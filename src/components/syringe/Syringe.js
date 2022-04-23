import "./Syringe.css";
import { useRef, useEffect } from "react";

function Syringe () {
    const canvasRef = useRef();

    useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);
    
    // sryinge point 
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(100, 125);
    context.lineTo(150, 120);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(100, 125);
    context.lineTo(150, 130);
    context.stroke();

    // creates filling 
    const filling = .4;
    context.beginPath();
    context.fillStyle = '#F06292';
    context.fillRect(150, 100, filling*400, 50);

    // creates rectangle
    context.beginPath();
    context.strokeStyle = 'white';
    context.strokeRect(150, 100, 400, 50);

    // creates half measurement mark
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(350, 130);
    context.lineTo(350, 150);
    context.stroke();

    // measurement marks in first half
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(190, 135);
    context.lineTo(190, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(230, 135);
    context.lineTo(230, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(270, 135);
    context.lineTo(270, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(310, 135);
    context.lineTo(310, 150);
    context.stroke();

    // measurement marks in second half
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(390, 135);
    context.lineTo(390, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(430, 135);
    context.lineTo(430, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(470, 135);
    context.lineTo(470, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(510, 135);
    context.lineTo(510, 150);
    context.stroke();

    // inbetween lines
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(170, 140);
    context.lineTo(170, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(210, 140);
    context.lineTo(210, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(250, 140);
    context.lineTo(250, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(290, 140);
    context.lineTo(290, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(330, 140);
    context.lineTo(330, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(370, 140);
    context.lineTo(370, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(410, 140);
    context.lineTo(410, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(450, 140);
    context.lineTo(450, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(490, 140);
    context.lineTo(490, 150);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(530, 140);
    context.lineTo(530, 150);
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