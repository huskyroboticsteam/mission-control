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

export const CameraStream = ({camera}: {camera: keyof typeof CameraNames}) => {
  const dispatch = useDispatch<RoverDispatch>()

  const roverIsConnected = useSelector(selectRoverIsConnected)
  const frameDataArray = useSelector(selectCameraStreamFrameData(camera))

  const [popoutActive, setPopoutActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const jmuxer = useRef<JMuxer | null>(null)
  const fps = useRef(0)
  const fpsRef = useRef<HTMLDivElement>(null)
  const fpsCalcTime = useRef(performance.now())
  const frameCount = useRef(0)
  const popoutWindow = useRef<Window | null>(null)
  const popoutCanvas = useRef<HTMLCanvasElement | null>(null)
  const popoutAnimFrameId = useRef<number | null>(null)

  const cameraTitle = camelCaseToTitle(camera)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    // Open the camera stream.
    dispatch(openCameraStream({camera}))

    // Create jmuxer
    jmuxer.current = new JMuxer({
      node: videoRef.current,
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
    })

    return () => {
      // Close the camera stream.
      dispatch(closeCameraStream({camera}))
      // Clean JMuxer
      jmuxer.current?.destroy()
    }
  }, [camera])

  useEffect(() => {
    if (frameDataArray && jmuxer.current) {
      frameDataArray.forEach((frame) => {
        jmuxer.current?.feed({video: new Uint8Array(frame)})
        frameCount.current++
      })

      const now = performance.now()
      const elapsed = now - fpsCalcTime.current
      if (elapsed >= 1000) {
        fps.current = Math.round((frameCount.current / elapsed) * 1000)
        frameCount.current = 0
        fpsCalcTime.current = now

        if (fpsRef.current) {
          fpsRef.current.textContent = `FPS: ${fps.current}`
        }
      }
    }
  }, [frameDataArray])

  useEffect(() => {
    return () => {
      // Clean up popout
      stopPopoutMirror()
      // Close popup if active
      popoutWindow.current?.close()
    }
  })

  const stopPopoutMirror = () => {
    if (popoutActive && popoutWindow.current && popoutAnimFrameId.current) {
      popoutWindow.current.cancelAnimationFrame(popoutAnimFrameId.current)
      popoutAnimFrameId.current = null
    }
    popoutCanvas.current = null
    popoutWindow.current = null
  }

  const startPopoutMirror = () => {
    const video = videoRef.current
    const win = popoutWindow.current
    const canvas = popoutCanvas.current
    if (!video || !win || !canvas) {
      return
    }

    const draw = () => {
      if (!win || win.closed) {
        stopPopoutMirror()
        setPopoutActive(false)
        return
      }

      const ctx = canvas.getContext('2d')
      if (ctx && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        // Resize window if needed
        if (canvas.width !== win.innerWidth || canvas.height !== win.innerHeight) {
          const aspectRatio = video.videoHeight / video.videoWidth
          if (win.innerHeight / win.innerWidth > aspectRatio) {
            canvas.width = Math.floor(win.innerWidth)
            canvas.height = Math.floor(win.innerWidth * aspectRatio)
          } else {
            canvas.width = Math.floor(win.innerHeight / aspectRatio)
            canvas.height = Math.floor(win.innerHeight)
          }
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      }

      popoutAnimFrameId.current = win.requestAnimationFrame(draw)
    }

    popoutAnimFrameId.current = win.requestAnimationFrame(draw)
  }

  const handlePopout: React.MouseEventHandler<HTMLSpanElement> = () => {
    if (!videoRef.current) {
      return
    }
    if (popoutWindow.current) {
      popoutWindow.current.focus()
      return
    }

    setPopoutActive(true)

    const popout = window.open('', '', 'width=600,height=400,resizable=yes,scrollbars=no')
    if (!popout || !videoRef.current) {
      return
    }

    popoutWindow.current = popout

    popout.document.title = `${cameraTitle} Stream`
    popout.document.body.style.cssText =
      'margin:0;background:#202225;display:flex;align-items:center;justify-content:center;height:100vh;overflow:hidden'

    const canvas = popout.document.createElement('canvas')
    canvas.style.cssText = 'background:#000;object-fit:contain'
    popout.document.body.appendChild(canvas)
    popoutCanvas.current = canvas

    const fpsDisplay = popout.document.createElement('div')
    fpsDisplay.style.cssText = 'position:absolute;color:red;top:10px;left:10px;z-index:5'
    fpsDisplay.textContent = `FPS: ${fps.current}`
    popout.document.body.appendChild(fpsDisplay)

    startPopoutMirror()

    popout.onbeforeunload = () => {
      setPopoutActive(false)
      stopPopoutMirror()
    }
  }

  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraTitle}</h2>
      <div className="video-container">
        <video
          id={`${camera}-player`}
          className="video-tag"
          ref={videoRef}
          muted
          autoPlay
          preload="auto"
          style={{opacity: popoutActive ? '0' : '1'}}
          aria-label={`${cameraTitle} stream`}
        />
        <div className="camera-stream-pop-header">
          <span
            className="camera-stream-pop-button"
            title={`Open "${cameraTitle}" camera stream in a new window.`}
            onClick={handlePopout}>
            <h3>Pop Out</h3>
          </span>
        </div>
      </div>
      {popoutActive ? (
        <h3>Stream in External Window</h3>
      ) : (
        !frameDataArray && <h3>No Stream Available</h3>
      )}
      <div className="camera-stream-fps" ref={fpsRef}>
        FPS: N/A
      </div>

      <div className="camera-stream-download-header">
        <button
          className="camera-stream-download-button"
          title={`Download "${cameraTitle}" camera stream current frame`}
          onClick={() => {
            dispatch(requestCameraFrame({camera}))
          }}
          disabled={!roverIsConnected}>
          Download
        </button>
        <button
          className="camera-stream-download-button"
          onClick={() => {
            dispatch(closeCameraStream({camera}))
          }}
          disabled={!roverIsConnected}>
          Off
        </button>
        <button
          className="camera-stream-download-button"
          onClick={() => {
            dispatch(openCameraStream({camera}))
          }}
          disabled={!roverIsConnected}>
          On
        </button>
      </div>
    </div>
  )
}

export default CameraStream
