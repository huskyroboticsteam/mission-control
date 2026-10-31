import React from 'react'
import './Wheel.css'

export const Wheel = ({
  className,
  steerDeg,
  spinRadPerSec,
}: {
  className: string
  steerDeg: number
  spinRadPerSec: number
}) => {
  return (
    <div className={`wheel-module ${className}`}>
      <div className="wheel" style={{transform: `rotate(${steerDeg}deg)`}}>
        <div className="wheel-arrow">▲</div>
      </div>
      <div className="wheel-readout">
        <div>steer: {steerDeg.toFixed(2)}°</div>
        <div>spin: {spinRadPerSec.toFixed(2)} rad/s</div>
      </div>
    </div>
  )
}
