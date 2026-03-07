import {useSelector} from 'react-redux'
import React, {useState} from 'react'
import './WaypointList.css'
import {selectRoverPosition} from '../../store/telemetrySlice.js'

type WaypointEntry = {
  title: string
  lat: number | null
  lon: number | null
}

function WaypointList() {
  const {lon, lat} = useSelector(selectRoverPosition)
  const [title, setTitle] = useState('')
  const [list, setList] = useState<WaypointEntry[]>([])

  return (
    <div>
      <div className="list-header">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button
          onClick={() => {
            setList([...list, {title, lat, lon}])
          }}>
          Add
        </button>
      </div>
      <div>
        {list.map((w, i) => (
          <div
            className="waypoint-display"
            key={`${w.title}-${i}`}>{`${w.title}:\t\t(${w.lat},${w.lon})`}</div>
        ))}
      </div>
    </div>
  )
}

export default WaypointList
