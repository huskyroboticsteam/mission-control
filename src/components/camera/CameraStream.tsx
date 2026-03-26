import {useCallback, useEffect, useMemo, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import JMuxer from 'jmuxer'
import {
  openCameraStream,
  closeCameraStream,
  selectCameraStreamFrameData,
  requestCameraFrame,
} from '../../store/cameraSlice.js'
import {selectRoverIsConnected} from '../../store/roverSocketSlice.js'
import {camelCaseToTitle} from '../../util/camelCaseToTitle.js'
import './CameraStream.css'
import React from 'react'
import type {CameraNames} from '../../constants/cameraConstants.js'
import type {RoverDispatch} from '../../store/store.js'
import {CameraPopout} from './CameraPopout.js'

export const CameraStream = ({camera}: {camera: keyof typeof CameraNames}) => {
  const dispatch = useDispatch<RoverDispatch>()

  const roverIsConnected = useSelector(selectRoverIsConnected)
  const frameDataArray = useSelector(selectCameraStreamFrameData(camera))
  
  const [jmuxer, setJMuxer] = useState<JMuxer | null>(null)
  const [hasRendered, setHasRendered] = useState(false)
  const [hasFrame, setHasFrame] = useState(false)
  const [popout, setPopout] = useState(false)

  const cameraTitle = camelCaseToTitle(camera)

  // abstract vidTag + player + jmuxer whatnot into its own file and then have this play in the popout?
  // maybe have an overall "Camera" element

  // const [lastFrameTime, setLastFrameTime] = useState(0.0)
  // const [currentFpsAvg, setCurrentFpsAvg] = useState(20)

  const vidTag = useMemo(() => {
    return (
      <video
        // style={{opacity: popoutWindow ? '0' : '1'}}
        id={`${camera}-player`}
        className="video-tag"
        muted
        autoPlay
        preload="auto"
        aria-label={`${cameraTitle} stream`}
      />
    )
  }, [camera])

  useEffect(() => {
    // Open the camera stream.
    dispatch(openCameraStream({camera}))

    // Create jmuxer
    setJMuxer(new JMuxer({
      node: `${camera}-player`,
      mode: 'video',
      flushingTime: 0,
      maxDelay: 50,
      clearBuffer: true,
      onError: (data) => {
        console.warn('Buffer error encountered', data)
      },

      onMissingVideoFrames: (data) => {
        console.warn('Video frames missing', data)
      },
    }))

    return () => {
      // Close the camera stream.
      dispatch(closeCameraStream({camera}))
    }
  }, [])

  // const requestDownloadFrame = useCallback(() => {
  //   dispatch(requestCameraFrame({camera}))
  // }, [camera, dispatch])

  useEffect(() => {
    if (frameDataArray && vidTag && jmuxer) {
      for (let i = 0; i < frameDataArray.length; i++) {
        jmuxer.feed({
          video: new Uint8Array(frameDataArray[i]),
        })
      }
      // const currentTime = Date.now()
      // if (currentTime !== lastFrameTime) {
      //   setCurrentFpsAvg((oldFps) => {
      //     let fps = (oldFps + 1 / ((currentTime - lastFrameTime) / 1000)) / 2
      //     // if (popoutWindow) {
      //     //   popoutWindow.document.querySelector('#ext-fps').innerText = `FPS: ${Math.round(fps)}`
      //     // }
      //     return fps
      //   })
      // }
      // if (vidTag) {
      //   let vid: HTMLVideoElement | null = document.querySelector(`#${vidTag.props.id}`)
      //   if (vid && vid.videoWidth && vid.videoHeight) {
      //     setHasFrame(true)
      //   }
      // }
      // setAspectRatio(
      //   document.querySelector(`#${camera}-player`).videoHeight /
      //     document.querySelector(`#${camera}-player`).videoWidth
      // )
      // setLastFrameTime(currentTime) // current time in ms
    }
  }, [frameDataArray])

  useEffect(() => {
    // this indicates that the site has rendered and the player is able to be modified (specifically the src)
    setHasRendered(true)
  }, [])

  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraTitle}</h2>
      <div className="video-container">{!popout && vidTag}</div>
      {popout ? <h3>Stream in External Window</h3> : !frameDataArray && <h3>No Stream Available</h3>}
      {/* <div className="camera-stream-fps">
        FPS: {currentFpsAvg && frameDataArray ? Math.round(currentFpsAvg) : 'N/A'}
      </div> */}
      <div className="camera-stream-pop-header">
        <span
          className="camera-stream-pop-button"
          title={`Open "${cameraTitle}" camera stream in a new window.`}
          onClick={() => setPopout(true)}>
          {popout ? <CameraPopout content={<div>{vidTag}</div>} setPopout={setPopout} /> : <h3>Pop Out</h3>}
        </span>
      </div>
      {/* <div className="camera-stream-download-header">
        <button
          className="camera-stream-download-button"
          title={`Download "${cameraTitle}" camera stream current frame`}
          onClick={() => {
            dispatch(requestCameraFrame({camera}))
          }}
          disabled={!(hasFrame && roverIsConnected)}>
          Download
        </button>
        <button
          className="camera-stream-download-button"
          onClick={() => {
            dispatch(closeCameraStream({camera}))
            setHasFrame(false)
          }}
          disabled={!(hasFrame && roverIsConnected)}>
          Off
        </button>
        <button
          className="camera-stream-download-button"
          onClick={() => {
            dispatch(openCameraStream({camera}))
          }}
          disabled={!(!hasFrame && roverIsConnected)}>
          On
        </button>
      </div> */}
    </div>
  )
}

export default CameraStream
