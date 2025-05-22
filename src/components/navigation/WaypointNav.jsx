import {useDispatch, useSelector} from 'react-redux'
import React, {useState, useEffect, useCallback} from 'react'
import {
  requestWaypointNav,
  setWaypointPosition,
  selectLatitude,
  selectLongitude,
} from '../../store/waypointNavSlice'
import {selectOpMode} from '../../store/opModeSlice'
import {selectRoverIsConnected} from '../../store/roverSocketSlice'
import './WaypointNav.css'

function WaypointNav() {
  const dispatch = useDispatch()
  const [submitted, setSubmitted] = useState(false)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)

  const [isWaypointSet, setIsWaypointSet] = useState(false)

  const storedLat = useSelector(selectLatitude)
  const storedLon = useSelector(selectLongitude)
  const opMode = useSelector(selectOpMode)

  const roverIsConnected = useSelector(selectRoverIsConnected)

  const handleWaypoint = useCallback(() => {
    dispatch(
      setWaypointPosition({
        longitude: lon,
        latitude: lat,
      })
    )
  }, [lat, lon])

  function handleSubmit(e) {
    e.preventDefault()
    if (roverIsConnected) {
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries())
      setSubmitted(true)
      dispatch(requestWaypointNav(formJson))
    }
  }

  function grabFromClipboard() {
    navigator.clipboard
      .readText()
      .then((text) => {
        // Matches coordinates in the form of (-)*(.*), (-)*(.*)
        // where * are numbers and () are optional, e.g. -0.2, 0
        if (text.match('-?\\d+\\.?\\d*, -?\\d+\\.?\\d*')) {
          const [lat, lon] = text.split(', ', 2)
          setLat(lat)
          setLon(lon)
        } else {
          alert('Clipboard contents do not match expected format lat, lon!')
        }
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err)
        alert(
          'Failed to read clipboard contents! (Make sure to allow us to read your clipboard contents)'
        )
      })
  }

  useEffect(() => {
    if (opMode === 'teleoperation') {
      setSubmitted(false)
    }
  }, [opMode])

  useEffect(() => {
    setIsWaypointSet(storedLat != null && storedLon != null)
  }, [storedLat, storedLon])

  return (
    <form method="post" onSubmit={handleSubmit} className="waypoint-select">
      <div className="waypoint-select__params">
        <label htmlFor="latitude">Latitude</label>
        <input
          disabled={isWaypointSet}
          type="number"
          step="any"
          name="latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <label htmlFor="longitude">Longitude</label>
        <input
          disabled={isWaypointSet}
          type="number"
          step="any"
          name="longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
        />
        <button disabled={isWaypointSet} type="button" onClick={grabFromClipboard}>
          Copy from Clipboard
        </button>
      </div>
      <div className="waypoint-checkbox">
        <label>
          <input disabled={isWaypointSet} type="checkbox" name="isApproximate" /> Approximate
        </label>
        <label>
          <input disabled={isWaypointSet} type="checkbox" name="isGate" /> Is Gate
        </label>
      </div>
      {isWaypointSet ? (
        <button
          className="unset-waypoint-button"
          disabled={submitted}
          type="button"
          onClick={() => {
            dispatch(setWaypointPosition({longitude: null, latitude: null}))
          }}>
          Unset Waypoint
        </button>
      ) : (
        <button type="button" onClick={handleWaypoint}>
          Set Waypoint
        </button>
      )}
      <button
        disabled={!roverIsConnected || opMode !== 'autonomous' || submitted || !isWaypointSet}
        type="submit">
        Go
      </button>
    </form>
  )
}

export default WaypointNav
