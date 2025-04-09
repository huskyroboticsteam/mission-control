import {useDispatch, useSelector} from 'react-redux'
import React, {useState, useEffect} from 'react'
import {requestWaypointNav} from '../../store/waypointNavSlice'
import {selectOpMode} from '../../store/opModeSlice'
import './WaypointNav.css'

function WaypointNav() {
  const dispatch = useDispatch()
  const [submitted, setSubmitted] = useState(false)
  const [points, setPoints] = useState([])
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  var opMode = useSelector(selectOpMode)

  function addPoint() {
    let point = [lat, lon]
    let newPoints = points
    newPoints.push(point)
    setPoints(newPoints)
    setLat(0)
    setLon(0)
    console.log(points)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const formJson = Object.fromEntries(formData.entries())
    setSubmitted(true)
    dispatch(requestWaypointNav(formJson))
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

  return (
    <form method="post" onSubmit={handleSubmit} className="waypoint-select">
      <div className="waypoint-select__params">
        <label htmlFor="latitude">Latitude</label>
        {submitted ? (
          <input disabled value={lat} onChange={(e) => e} />
        ) : (
          <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
        )}
        <label htmlFor="longitude">Longitude</label>
        {submitted ? (
          <input disabled value={lon} onChange={(e) => e} />
        ) : (
          <input type="number" step="any" value={lon} onChange={(e) => setLon(e.target.value)} />
        )}
        {/* temp note: currently sends first value of points in latitude and longitude, eventually want to switch to
        only using the points array. */}
        <input type="hidden" value={points.length > 0 ? points[0][0] : 0} name="latitude"></input>
        <input type="hidden" value={points.length > 0 ? points[0][1] : 0} name="longitude"></input>
        <input type="hidden" value={JSON.stringify(points)} name="points"></input>

        {submitted ? (
          <button disabled>Copy from Clipboard</button>
        ) : (
          <button type="button" onClick={grabFromClipboard}>
            Copy from Clipboard
          </button>
        )}
        <button type="button" onClick={addPoint}>
          Add Point
        </button>
      </div>
      <div className="waypoint-checkbox">
        <label>
          {submitted ? (
            <input disabled type="checkbox" name="isApproximate" />
          ) : (
            <input type="checkbox" name="isApproximate" />
          )}{' '}
          Approximate
        </label>
        <label>
          {submitted ? (
            <input disabled type="checkbox" name="isGate" />
          ) : (
            <input type="checkbox" name="isGate" />
          )}{' '}
          Is Gate
        </label>
      </div>
      {opMode === 'autonomous' && !submitted ? (
        <button type="submit">Go</button>
      ) : (
        <button disabled>Go</button>
      )}
    </form>
  )
}

export default WaypointNav
