<<<<<<< HEAD
import {useDispatch, useSelector} from 'react-redux'
import React, {useState, useEffect} from 'react'
import {requestWaypointNav} from '../../store/waypointNavSlice'
import {selectOpMode} from '../../store/opModeSlice'
import './WaypointNav.css'
=======
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useCallback } from "react";
import { requestWaypointNav, setWaypointPosition } from "../../store/waypointNavSlice";
import { selectOpMode } from "../../store/opModeSlice";
import "./WaypointNav.css";
>>>>>>> b766c34 (Added set waypoint button, different from Go button)

function WaypointNav() {
  const dispatch = useDispatch()
  const [submitted, setSubmitted] = useState(false)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  var opMode = useSelector(selectOpMode)

<<<<<<< HEAD
  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const formJson = Object.fromEntries(formData.entries())
    setSubmitted(true)
    dispatch(requestWaypointNav(formJson))
  }
=======
  const handleWaypoint = useCallback(() => {
    dispatch(setWaypointPosition({
      longitude: lon,
      latitude: lat
    }));
  }, [lat, lon]);

  function handleSubmit (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    setSubmitted(true);
    dispatch(requestWaypointNav(formJson));
  };
>>>>>>> b766c34 (Added set waypoint button, different from Go button)

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
<<<<<<< HEAD
    <form method="post" onSubmit={handleSubmit} className="waypoint-select">
      <div className="waypoint-select__params">
        <label htmlFor="latitude">Latitude</label>
        {submitted ? (
          <input disabled value={lat} onChange={(e) => e} />
        ) : (
          <input
            type="number"
            step="any"
            name="latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        )}
        <label htmlFor="longitude">Longitude</label>
        {submitted ? (
          <input disabled value={lon} onChange={(e) => e} />
        ) : (
          <input
            type="number"
            step="any"
            name="longitude"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
        )}
        {submitted ? (
          <button disabled>Copy from Clipboard</button>
        ) : (
          <button type="button" onClick={grabFromClipboard}>
            Copy from Clipboard
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
  )
=======
  <form method="post" onSubmit={handleSubmit} className="waypoint-select"> 
    <div className="waypoint-select__params">
      <label htmlFor="latitude">Latitude</label>
      {submitted ? <input disabled value={lat} onChange={e => e}/> : <input type="number" step="any" name="latitude" value={lat} onChange={e => setLat(e.target.value)}/>}
      <label htmlFor="longitude">Longitude</label>
      {submitted ? <input disabled value={lon} onChange={e => e}/> : <input type="number" step="any" name="longitude" value={lon} onChange={e => setLon(e.target.value)}/>}
      {submitted ? <button disabled>Copy from Clipboard</button> : <button type="button" onClick={grabFromClipboard}>Copy from Clipboard</button>}
    </div>
    <div className="waypoint-checkbox">
      <label>{submitted ? <input disabled type="checkbox" name="isApproximate" /> : <input type="checkbox" name="isApproximate" />} Approximate</label>
      <label>{submitted ? <input disabled type="checkbox" name="isGate" />: <input type="checkbox" name="isGate" />} Is Gate</label>
    </div>
    {!submitted ? <button type="button" onClick={handleWaypoint}>Set Waypoint</button> : <button disabled type="button">Set Waypoint</button>}
    {opMode === "autonomous" && !submitted ? <button type="submit">Go</button> : <button disabled>Go</button>}
  </form>
  );
>>>>>>> b766c34 (Added set waypoint button, different from Go button)
}

export default WaypointNav
