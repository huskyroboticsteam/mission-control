import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./PanoramicCamera.css";

function PanoramicCamera () {
    
    useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);
    
   
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
        <div className="panoramicCamera">
          <h2 className="spanoramicCamera__panoramicCamera-name">Syringe</h2>
          <canvas ref={canvasRef} className="syringe" width={width} height={height} />
        </div>
    
      );
    } 

function clear(canvasContext) {
    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

export default PanoramicCamera;