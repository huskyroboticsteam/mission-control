import {useDispatch, useSelector} from 'react-redux'
import React, {useState, useEffect} from 'react'
import {requestWaypointNav, selectLongitude} from '../../store/waypointNavSlice'
import {selectOpMode} from '../../store/opModeSlice'
import {selectRoverIsConnected} from '../../store/roverSocketSlice'
import './WaypointNav.css'

function WaypointNav() {
  const dispatch = useDispatch()
  const [submitted, setSubmitted] = useState(false)
  const [points, setPoints] = useState([])
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [editingPoint, setEditingPoint] = useState(false)
  var [editPointIndex, setEditPointIndex] = useState(-1)
  var opMode = useSelector(selectOpMode)

  //either adds point if in add point state or edits point if in editing state
  function addPoint() {
    const newPoints = points.slice()
    const point = [lat, lon]
    //slicing because just copying the list leads to the html not re-rendering when lat & lon are 0
    //this is an edge case, but still
    newPoints.push(point)
    setPoints(newPoints)
    setLat(0)
    setLon(0)
  }

  function editPoint() {
    const newPoints = points.slice()
    const point = [lat, lon]
    newPoints[editPointIndex] = point
    setPoints(newPoints)
    exitEditPointState()
  }

  function removePoint(index) {
    //slicing because just copying the list leads to the html not re-rendering
    const newPoints = points.slice()
    newPoints.splice(index, 1)
    setPoints(newPoints)
  }

  //move point by swapping values of the point at index & point one above
  function movePointUp(index) {
    //slicing because just copying the list leads to the html not re-rendering
    const newPoints = points.slice()
    const indexLat = newPoints[index][0]
    const indexLon = newPoints[index][1]
    newPoints[index][0] = newPoints[index - 1][0]
    newPoints[index][1] = newPoints[index - 1][1]
    newPoints[index - 1][0] = indexLat
    newPoints[index - 1][1] = indexLon
    setPoints(newPoints)
  }

  //move point by swapping values of the point at index & point one below
  function movePointDown(index) {
    //slicing because just copying the list leads to the html not re-rendering
    const newPoints = points.slice()
    const indexLat = newPoints[index][0]
    const indexLon = newPoints[index][1]
    newPoints[index][0] = newPoints[index + 1][0]
    newPoints[index][1] = newPoints[index + 1][1]
    newPoints[index + 1][0] = indexLat
    newPoints[index + 1][1] = indexLon
    setPoints(newPoints)
  }

  //change the state to editing and change the values in the point fill to be the values in the point we're editing
  function enterEditPointState(index) {
    setEditingPoint(true)
    setEditPointIndex(index)
    setLat(points[index][0])
    setLon(points[index][1])
  }

  //change the state to adding points and change values to default
  function exitEditPointState() {
    setEditingPoint(false)
    setEditPointIndex(-1) //just in case, so that no point thinks we're editing it
    setLat(0)
    setLon(0)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (roverIsConnected) {
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries())
      setSubmitted(true)
      dispatch(requestWaypointNav(formJson))
    }
    points.length = 0
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
    <div className="waypoint-nav">
      {' '}
      {/* only here to create a parent element for the form and the point list */}
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
          {/* temp note: currently sends first value of points in latitude and longitude for testing, eventually want to switch to
          only using the points array. */}
          <input type="hidden" value={points.length > 0 ? points[0][0] : 0} name="latitude"></input>
          <input
            type="hidden"
            value={points.length > 0 ? points[0][1] : 0}
            name="longitude"></input>
          <input type="hidden" value={JSON.stringify(points)} name="points"></input>

          {submitted ? (
            <button disabled>Copy from Clipboard</button>
          ) : (
            <button type="button" onClick={grabFromClipboard}>
              Copy from Clipboard
            </button>
          )}
          {/* The add button changes to an edit point when a point is within an edit state */}
          {submitted ? (
            <button disabled>Add Point</button>
          ) : editingPoint ? (
            <button type="button" onClick={editPoint}>
              Edit Point {editPointIndex + 1}
            </button>
          ) : (
            <button type="button" onClick={addPoint}>
              Add Point
            </button>
          )}
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
      <div className="waypoint-array">
        <div>
          <h3>Waypoint Points:</h3>
          
        </div>
        <ol>
          {points.map((point, index) => (
            <li
              key={index}
              style={{color: editingPoint && editPointIndex == index ? 'red' : 'white'}}>
              <p>
                ({point[0]}, {point[1]})
              </p>
              <button type="button" className="remove-points" onClick={() => removePoint(index)}>
                Remove
              </button>
              {/* the edit button turns to a cancel button if the point is currently being edited */}
              {editingPoint && index == editPointIndex ? (
                <button type="button" className="edit-points" onClick={exitEditPointState}>
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  className="edit-points"
                  onClick={() => enterEditPointState(index)}>
                  Edit
                </button>
              )}
              <br></br>
              <button
                hidden={index == 0}
                type="button"
                className="move-points"
                onClick={() => movePointUp(index)}>
                Move Up
              </button>
              <button
                hidden={index == points.length - 1}
                type="button"
                className="move-points"
                onClick={() => movePointDown(index)}>
                Move Down
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default WaypointNav
