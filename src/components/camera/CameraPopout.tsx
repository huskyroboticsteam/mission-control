import React, {useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'

export const CameraPopout = ({content}: {content: React.JSX.Element}) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const newWindow = useRef<Window | null>(null)

  useEffect(() => {
    setContainer(document.createElement('div'))
  }, [])

  useEffect(() => {
    if (container) {
      newWindow.current = window.open(
        "",
        "",
        "width=600,height=400,left=200,top=200" 
      )

      const currWindow = newWindow.current
      if (currWindow) {
        newWindow.current.document.title = 'Stream'
        newWindow.current?.document.body.appendChild(container)

      }

      return () => currWindow?.close()
    }
  }, [container])

  return container && createPortal(content, container)
}

// /**
//  * Takes:
//  *    cameraName: the camera name,
//  *    unloadCallback: a callback that is ran before the window is fully unloaded
//  *    downloadCallback: a callback that is ran when the download button is pressed
//  * Returns: Promise of an object with keys: window, canvas, context, aspectRatio
//  */
// async function createPopOutWindow(cameraName: keyof typeof CameraNames, unloadCallback, downloadCallback) {
//   const cameraTitle = camelCaseToTitle(cameraName);
//   const newWindow = window.open('/camera/cam_popout.htm', '', 'width=500,height=500')
//   if (!newWindow) { return; }

//   const returnPromise = new Promise((resolve, reject) => {
//     newWindow.onload = () => {
//       newWindow.document.title = `${cameraTitle} Stream`
//       newWindow.document.querySelector('#ext-title')!.innerText = cameraTitle
//       newWindow.document.querySelector('#ext-download-button')!.onclick = downloadCallback
//       let canvas: HTMLCanvasElement | null = newWindow.document.querySelector('#ext-vid')
//       let context = canvas.getContext('2d')
//       let aspectRatio =
//         document.querySelector(`#${cameraName}-player`).videoHeight /
//         document.querySelector(`#${cameraName}-player`).videoWidth
//       canvas.width = aspectRatio * 400
//       canvas.height = 400
//       context.fillStyle = 'blue'
//       context.fillRect(0, 0, canvas.width, canvas.height)

//       window.onunload = () => {
//         if (newWindow && !newWindow.closed) {
//           newWindow.close()
//         }
//       }

//       newWindow.onbeforeunload = unloadCallback

//       let output = {
//         popout: newWindow,
//         canvas: canvas,
//         context: context,
//         aspectRatio: aspectRatio,
//       }
//       resolve(output)
//     }
//   })

//   return returnPromise
// }

//   const [popoutWindow, setPopoutWindow] = useState<Window | null>(null)
//   const [aspectRatio, setAspectRatio] = useState(1)

//   const cameraCanvas: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null) // used for popout window
//   const cameraContext: React.MutableRefObject<CanvasRenderingContext2D | null> = useRef(null) // used for popout window

//   const drawFrameOnExt = useCallback(
//     (window: Window, last_ww: number, last_wh: number) => {
//       if (vidTag && window && cameraCanvas.current) {
//         // draw it onto the popout window

//         if (window.innerWidth !== last_ww || window.innerHeight !== last_wh) {
//           // if the window is wider than the stream
//           if (window.innerHeight / window.innerWidth > aspectRatio) {
//             // set the height of the canvas to the height of the window
//             cameraCanvas.current.width = Math.floor(window.innerWidth)
//             cameraCanvas.current.height = Math.floor(window.innerWidth * aspectRatio)
//           } else {
//             // set the width of the canvas to the height of the window
//             cameraCanvas.current.width = Math.floor(window.innerHeight / aspectRatio)
//             cameraCanvas.current.height = Math.floor(window.innerHeight)
//           }
//         }

//         let video: HTMLVideoElement = document.querySelector(`#${vidTag.props.id}`)!
//         cameraContext.current?.drawImage(
//           video,
//           0,
//           0,
//           cameraCanvas.current.width,
//           cameraCanvas.current.height
//         )
//         last_ww = window.innerWidth
//         last_wh = window.innerHeight
//         window.requestAnimationFrame(() => {
//           drawFrameOnExt(window, last_ww, last_wh)
//         })
//       }
//     },
//     [vidTag, aspectRatio]
//   )
//     useEffect(() => {
//       if (popoutWindow) {
//         let button = popoutWindow.document.querySelector('#ext-download-button') as HTMLButtonElement
//         if (button) button.disabled = !(hasFrame && roverIsConnected)
//       }
//     }, [popoutWindow, hasFrame, roverIsConnected])

//     const handlePopOut = useCallback(async () => {
//       if (popoutWindow) {
//         // if the window popout exists
//         popoutWindow.close()
//         setPopoutWindow(null)
//       } else if (vidTag) {
//         // if the window popout doesn't exist
//         let {popout, canvas, context, aspectRatio} = await createPopOutWindow(
//           cameraTitle,
//           camera,
//           () => setPopoutWindow(null),
//           requestDownloadFrame
//         )
//         setAspectRatio(aspectRatio)
//         setPopoutWindow(popout)
//         cameraCanvas.current = canvas
//         cameraContext.current = context
//         popout.requestAnimationFrame(() => {
//           drawFrameOnExt(popout, 0, 0)
//         })
//       }
//     }, [popoutWindow, cameraTitle, camera, drawFrameOnExt, vidTag])

//   useEffect(() => {
//     return () => {
//       if (popoutWindow) {
//         popoutWindow.close()
//       }
//     }
//   }, [popoutWindow])
