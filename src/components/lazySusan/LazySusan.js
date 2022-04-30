//testing
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLazySusanPosition, selectLidPosition } from "../../store/scienceSlice";
import "./LazySusan.css";

function LazySusan() {
  const canvasRef = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const r = width/4;
  const center_x = width/2;
  const center_y = height/2 + height/20;
  const big_r = Math.min(width, height);
  const line_width = big_r/350 * 6;
  
  const position = useSelector(selectLazySusanPosition);
  const closed = useSelector(selectLidPosition); // 0 is closed
  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clear(context);
    context.beginPath();
    context.ellipse(
      center_x,
      center_y ,
      2*big_r/5,
      2*big_r/5,
      0,
      0, 2 * Math.PI
    );
    context.fillStyle = 'white';
    context.fill();

    // line through circle for closed
    context.beginPath();
    context.moveTo((0.5 * r) + center_x - 0.7*width/10, -0.866 * r + center_y - 0.7*width/10);
    context.lineTo((0.5 * r) + center_x + 0.7*width/10, -0.866 * r + center_y + 0.7*width/10);
    context.lineWidth = line_width;
    context.strokeStyle = 'white';
    if (closed == true && position != 0) {
      context.strokeStyle = 'grey';
    }
    else if (closed == true && position == 0) {
      context.strokeStyle = 'pink';
    }
    context.fill();
    context.stroke();

    
    context.beginPath();
    context.moveTo((r) + center_x - 0.7*width/10, 0 + center_y - 0.7*width/10);
    context.lineTo((r) + center_x + 0.7*width/10, 0 + center_y + 0.7*width/10);
    context.lineWidth = line_width;
    context.strokeStyle = 'white';
    if (closed == true && position != 1) {
      context.strokeStyle = 'grey';
    }
    else if (closed == true && position == 1) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    context.beginPath();
    context.moveTo((0.5 * r) + center_x - 0.7*width/10, 0.866 * r + center_y -0.7*width/10);
    context.lineTo((0.5 * r) + center_x + 0.7*width/10, 0.866 * r + center_y + 0.7*width/10);
    context.lineWidth = line_width;
    context.strokeStyle = 'white';
    if (closed == true && position != 2) {
      context.strokeStyle = 'grey';
    }
    else if (closed == true && position == 2) {
      context.strokeStyle = 'pink';
    }
    context.stroke();


    context.beginPath();
    context.moveTo((-0.5 * r) + center_x - 0.7*width/10, 0.866 * r + center_y -0.7*width/10);
    context.lineTo((-0.5 * r) + center_x + 0.7*width/10, 0.866 * r + center_y + 0.7*width/10);
    context.lineWidth = line_width;
    context.strokeStyle = 'white';
    if (closed == true && position != 3) {
      context.strokeStyle = 'grey';
    }
    else if (closed == true && position == 3) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    context.beginPath();
    context.moveTo((-0.5 * r) + center_x - 0.7*width/10, -0.866 * r + center_y -0.7*width/10);
    context.lineTo((-0.5 * r) + center_x + 0.7*width/10, -0.866 * r + center_y + 0.7*width/10);
    context.lineWidth = line_width;
    context.strokeStyle = 'white';
    if (closed == true && position != 5) {
      context.strokeStyle = 'grey';
    }
    else if (closed == true && position == 5) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    context.beginPath();
    context.moveTo((-1 * r) + center_x - 0.7*width/10, 0 + center_y -0.7*width/10);
    context.lineTo((-1 * r) + center_x + 0.7*width/10, -0 + center_y + 0.7*width/10);
    context.lineWidth = line_width;
    context.strokeStyle = 'white';
    if (closed == true && position != 4) {
      context.strokeStyle = 'grey';
    }
    else if (closed == true && position == 4) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    // cup circles

    context.beginPath();
    context.ellipse(
      (0.5 * r) + center_x,
      -0.866 * r + center_y,
      width/10,
      width/10,
      0,
      0, 2 * Math.PI
    );
    context.strokeStyle = 'grey';
    if (position == 0) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    context.beginPath();
    context.ellipse(
      (r) + center_x,
      0 + center_y,
      width/10,
      width/10,
      0,
      0, 2 * Math.PI
    );
    context.strokeStyle = 'grey';
    if (position == 1) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    context.beginPath();
    context.ellipse(
      (0.5 * r) + center_x,
      0.866 * r + center_y,
      width/10,
      width/10,
      0,
      0, 2 * Math.PI
    );
    context.strokeStyle = 'grey';
    if (position == 2) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    context.beginPath();
    context.ellipse(
      (-0.5 * r) + center_x,
      0.866 * r + center_y,
      width/10,
      width/10,
      0,
      0, 2 * Math.PI
    );
    context.strokeStyle = 'grey';
    if (position == 3) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    context.beginPath();
    context.ellipse(
      (-1 * r) + center_x,
      0 + center_y,
      width/10,
      width/10,
      0,
      0, 2 * Math.PI
    );
    context.strokeStyle = 'grey';
    if (position == 4) {
      context.strokeStyle = 'pink';
    }
    context.stroke();

    context.beginPath();
    context.ellipse(
      (-0.5 * r) + center_x,
      -0.866 * r + center_y,
      width/10,
      width/10,
      0,
      0, 2 * Math.PI
    );
    context.strokeStyle = 'grey';
    if (position == 5) {
      context.strokeStyle = 'pink';
    }
    context.stroke();


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
    <div className="lazy-susan">
      <h2 className="lazy-susan__lazy-susan-name">Lazy Susan</h2>
      <canvas ref={canvasRef} className="lazy-susan" width={width} height={height} />
    </div>

  );
}

function clear(canvasContext) {
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

export default LazySusan;
