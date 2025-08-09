import React, {useState} from 'react'
import { convertCoordsToDistance, convertCoordsToHeading } from './Compass'
import './Calculator.css'

function Calculator() {
  const [startlat, setStartLat] = useState(0)
  const [startlon, setStartLon] = useState(0)
  const [endlat, setEndLat] = useState(0)
  const [endlon, setEndLon] = useState(0)

  return (
    <div className='calc-panel'>
      <div className='waypoint-inputs'>
        <div className='waypoint-input'>
          Start
          <input placeholder='Latitude' type='number' value={startlat} onChange={e => setStartLat(e.target.value)} />
          <input placeholder='Longitude' type='number' value={startlon} onChange={e => setStartLon(e.target.value)} />
        </div>
        <div className='waypoint-input'>
          End
          <input placeholder='Latitude' type='number' value={endlat} onChange={e => setEndLat(e.target.value)} />
          <input placeholder='Longitude' type='number' value={endlon} onChange={e => setEndLon(e.target.value)} />
        </div>
      </div>
      <div className='results'>
        <div>{`Distance: ${convertCoordsToDistance(startlat, startlon, endlat, endlon)}km`}</div>
        <div>{`Bearing: ${convertCoordsToHeading(startlat, startlon, endlat, endlon)}°`}</div>
      </div>
    </div>
  )
}

export default Calculator
