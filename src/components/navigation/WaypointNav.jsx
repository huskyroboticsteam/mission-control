import {useDispatch, useSelector} from 'react-redux'
import React, {useState, useEffect} from 'react'
import {requestWaypointNav, setPoints, selectPoints} from '../../store/waypointNavSlice'
import {selectOpMode} from '../../store/opModeSlice'
import {selectRoverIsConnected} from '../../store/roverSocketSlice'
import './WaypointNav.css'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function WaypointNav() {
  const dispatch = useDispatch()
  const roverIsConnected = useSelector(selectRoverIsConnected)
  const [submitted, setSubmitted] = useState(false)
  const points = useSelector(selectPoints) || []
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [editingPoint, setEditingPoint] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editPointIndex, setEditPointIndex] = useState(-1)
  const opMode = useSelector(selectOpMode)

  //either adds point if in add point state or edits point if in editing state
  function addPoint() {
    const parsedLat = Number.parseFloat(lat)
    const parsedLon = Number.parseFloat(lon)

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
      alert('Please enter valid latitude and longitude values before adding a waypoint.')
      return
    }

    const newPoints = [...points.map((point) => [...point]), [parsedLat, parsedLon]]
    dispatch(setPoints(newPoints))
    setLat(0)
    setLon(0)
  }

  function editPoint() {
    const parsedLat = Number.parseFloat(lat)
    const parsedLon = Number.parseFloat(lon)

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
      alert('Please enter valid latitude and longitude values before saving a waypoint.')
      return
    }

    const newPoints = points.map((point, index) =>
      index === editPointIndex ? [parsedLat, parsedLon] : [...point]
    )
    dispatch(setPoints(newPoints))
    exitEditPointState()
  }

  //delete point at index 
  function deletePoint(index) {
    const newPoints = points.filter((_, i) => i !== index)
    dispatch(setPoints(newPoints))
    
    // Handle editing state
    if (editingPoint) {
      if (editPointIndex === index) {
        // We're deleting the point being edited, exit edit mode
        exitEditPointState()
      } else if (editPointIndex > index) {
        // We're deleting a point before the one being edited, adjust the index
        setEditPointIndex(editPointIndex - 1)
      }
      // If editPointIndex < index, no adjustment needed
    }
  }

  //move point by swapping values of the point at index & point one above
  function movePointUp(index) {
    const newPoints = points.map((point) => [...point])
    const indexLat = newPoints[index][0]
    const indexLon = newPoints[index][1]
    newPoints[index][0] = newPoints[index - 1][0]
    newPoints[index][1] = newPoints[index - 1][1]
    newPoints[index - 1][0] = indexLat
    newPoints[index - 1][1] = indexLon
    dispatch(setPoints(newPoints))
  }

  //move point by swapping values of the point at index & point one below
  function movePointDown(index) {
    const newPoints = points.map((point) => [...point])
    const indexLat = newPoints[index][0]
    const indexLon = newPoints[index][1]
    newPoints[index][0] = newPoints[index + 1][0]
    newPoints[index][1] = newPoints[index + 1][1]
    newPoints[index + 1][0] = indexLat
    newPoints[index + 1][1] = indexLon
    dispatch(setPoints(newPoints))
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
    if (!roverIsConnected) {
      return
    }

    if (points.length === 0) {
      alert('Please add at least one waypoint before submitting.')
      return
    }

    const requestPoints = points.map((point) => [...point])

    setSubmitted(true)
    dispatch(requestWaypointNav({points: requestPoints}))
    exitEditPointState()
    dispatch(setPoints([]))
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
    if (points.length > 0) {
      setIsOpen(true)
    }
  }, [points.length])

  return (
    <div className="waypoint-nav">
      {' '}
      {/* only here to create a parent element for the form and the point list */}
      <form method="post" onSubmit={handleSubmit} className="waypoint-select">
        <div className="waypoint-select__params">
          <div className="lat-lon-row">
            <div className="input-group">
              <label htmlFor="latitude">Latitude</label>
              {submitted ? (
                <input disabled value={lat} onChange={(e) => e} />
              ) : (
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              )}
            </div>
            <div className="input-group">
              <label htmlFor="longitude">Longitude</label>
              {submitted ? (
                <input disabled value={lon} onChange={(e) => e} />
              ) : (
                <input
                  type="number"
                  step="any"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="button-row">
            {/* COPY FROM CLIPBOARD BUTTON */}
            {submitted ? (
              <button disabled className="icon-button" aria-label="Clipboard disabled">
                <ContentPasteIcon fontSize="small" style={{marginRight: 6}} />
              </button>
            ) : (
              <button type="button" onClick={grabFromClipboard} className="icon-button">
                <ContentPasteIcon fontSize="small" />
              </button>
            )}

            {/* ADD / EDIT POINT BUTTON */}
            {submitted ? (
              <button disabled className="icon-button" aria-label="Add disabled">
                <AddIcon fontSize="small" />
              </button>
            ) : editingPoint ? (
              <button type="button" onClick={editPoint} className="icon-button">
                <EditIcon fontSize="small" />
              </button>
            ) : (
              <button type="button" onClick={addPoint} className="icon-button">
                <AddIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>
        <div className="submit-row">
          {opMode === 'autonomous' && !submitted ? (
            <button type="submit" className="go-button">
              Go
            </button>
          ) : (
            <button disabled className="go-button">
              Go
            </button>
          )}
        </div>
      </form>
      <div className="waypoint-array">
        <div className="waypoint-array__header">
          <span>Waypoints</span>
          <button
            type="button"
            className="waypoint-toggle"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}>
            {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </button>
        </div>
        {isOpen && (
          <div className="waypoint-list">
            {points.length === 0 ? (
              <p className="waypoint-empty">No waypoints added yet.</p>
            ) : (
              points.map((point, index) => {
                const isEditing = editingPoint && editPointIndex === index
                return (
                  <div
                    key={`${point[0]}-${point[1]}-${index}`}
                    className={`waypoint-item${isEditing ? ' waypoint-item--editing' : ''}`}>
                    <span className="waypoint-item__coords">
                      ({point[0]}, {point[1]})
                    </span>
                    <div className="waypoint-item__actions">
                      {isEditing ? (
                        <button
                          type="button"
                          className="icon-button"
                          onClick={exitEditPointState}
                          disabled={submitted}>
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => enterEditPointState(index)}
                          disabled={submitted}>
                          <EditIcon fontSize="small" />
                        </button>
                      )}
                      {/* delete button added 1/13 */}
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => deletePoint(index)}
                        disabled={submitted}>
                        <DeleteForeverIcon fontSize="small" />
                      </button>
                      {/*delete button added 1/13*/}
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => movePointUp(index)}
                        disabled={submitted || index === 0}>
                        <ArrowUpwardIcon fontSize="small" />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => movePointDown(index)}
                        disabled={submitted || index === points.length - 1}>
                        <ArrowDownwardIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WaypointNav
