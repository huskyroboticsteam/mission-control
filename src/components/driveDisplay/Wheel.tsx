import React from 'react'
import './Wheel.css'

export const Wheel = ({className, steerDeg}: {className: string; steerDeg: number}) => {
  return <div className={`wheel ${className}`} style={{transform: `rotate(${steerDeg}deg)`}}></div>
}
