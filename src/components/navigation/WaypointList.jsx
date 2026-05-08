import {useSelector, useDispatch} from 'react-redux'
import React, {useState} from 'react'
import './WaypointList.css'
import {selectRoverPosition} from '../../store/telemetrySlice'
import {setPoints, selectPoints} from '../../store/waypointNavSlice'

function WaypointList() {
  const {lon, lat} = useSelector(selectRoverPosition)
  const points = useSelector(selectPoints)
  const dispatch = useDispatch()
  const [tag, setTag] = useState('')
  const [radius, setRadius] = useState(0)
  const [circleMode, setCircleMode] = useState(false)

  function addWaypoint() {
    dispatch(setPoints([...points, {lat, lon, radius: Number(radius), tag, circleMode}]))
  }

  return (
    <div>
      <div className="list-header">
        <input type="text" placeholder="Tag" value={tag} onChange={(e) => setTag(e.target.value)} />
        <input
          type="number"
          placeholder="Radius"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
        <label>
          <input type="checkbox" checked={circleMode} onChange={(e) => setCircleMode(e.target.checked)} />
          Circle
        </label>
        <button onClick={addWaypoint}>Add</button>
      </div>
      <div>
        {points.map((w, i) => (
          <div key={i} className="waypoint-display">
            {`${w.tag ? w.tag + ': ' : ''}(${w.lat}, ${w.lon})${w.circleMode ? ` r=${w.radius}` : ''}`}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WaypointList
