import {useSelector} from 'react-redux'
import React, {useState} from 'react'
import './WaypointList.css'
import {selectRoverPosition} from '../../store/telemetrySlice'
import {randFloat} from 'three/src/math/MathUtils'

function WaypointList() {
  // const {_, __, ___, ____, lon, lat, _____} = useSelector(selectRoverPosition)
  const [title, setTitle] = useState('')
  const [list, setList] = useState([])
  const lat = randFloat(-142, 142)
  const lon = randFloat(-142, 142)

  return (
    <div>
      <div className="list-header">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button
          onClick={() => {
            setList([...list, {title: title, lat: lat, lon: lon}])
          }}>
          Add
        </button>
      </div>
      <div>
        {list.map((w) => (
          <div className="waypoint-display">{`${w.title}:\t\t(${w.lat},${w.lon})`}</div>
        ))}
      </div>
    </div>
  )
}

export default WaypointList
