import {
  openCameraStream,
  closeCameraStream,
  cameraStreamDataReportReceived,
  requestCameraFrame,
} from '../camerasSlice'
import {
  messageReceivedFromRover,
  messageRover,
  roverConnected,
  roverDisconnected,
} from '../roverSocketSlice'
import camelCaseToTitle from '../../util/camelCaseToTitle'

import {selectRoverPosition} from '../../store/telemetrySlice'
import {piexif} from 'piexifjs'
import {useSelector} from 'react-redux'

/**
 * Middleware that handles requesting and receiving camera streams from the
 * rover.
 */
const camerasMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case openCameraStream.type: {
      store.dispatch(
        messageRover({
          message: {
            type: 'cameraStreamOpenRequest',
            camera: action.payload.cameraName,
            fps: 20, // default to 20
          },
        })
      )
      break
    }

    case closeCameraStream.type: {
      store.dispatch(
        messageRover({
          message: {
            type: 'cameraStreamCloseRequest',
            camera: action.payload.cameraName,
          },
        })
      )
      break
    }

    case requestCameraFrame.type: {
      store.dispatch(
        messageRover({
          message: {
            type: 'cameraFrameRequest',
            camera: action.payload.cameraName,
          },
        })
      )
      break
    }

    case roverConnected.type: {
      // Inform the rover of camera streams we would like to receive when we
      // connect.
      const cameras = store.getState().cameras
      Object.keys(cameras).forEach((cameraName) => {
        const camera = cameras[cameraName]
        if (camera.isStreaming) {
          store.dispatch(
            messageRover({
              message: {
                type: 'cameraStreamOpenRequest',
                camera: cameraName,
                fps: 20, // default to 20
              },
            })
          )
        }
      })
      break
    }

    case roverDisconnected.type: {
      const cameras = store.getState().cameras
      Object.keys(cameras).forEach((cameraName) => {
        const camera = cameras[cameraName]
        if (camera.isStreaming && camera.frameData !== null) {
          store.dispatch(
            cameraStreamDataReportReceived({
              cameraName,
              frameData: null,
            })
          )
        }
      })
      break
    }

    case messageReceivedFromRover.type: {
      const {message} = action.payload
      if (message.type === 'cameraStreamReport') {
        store.dispatch(
          cameraStreamDataReportReceived({
            cameraName: message.camera,
            frameData: message.data,
          })
        )
      } else if (message.type === 'cameraFrameReport' && message.data !== '') {
        console.log(message)
        let jpegData = `data:image/jpeg;base64,${message.data}`
        let out = jpegData
  
        // Fits the telemetry(position/gps) data into exif metadata
        let gpsIfd = {}

        // put altitude
        gpsIfd[piexif.GPSIFD.GPSAltitude] = message.alt
        console.log(gpsIfd[piexif.GPSIFD.GPSAltitude])
        
        // converts & puts latitude data (decimal --> dms)
        const lat = Math.abs(message.lat)
        const latRef = message.lat >= 0 ? 'N' : 'S'
        gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = latRef

        
        const degreesLat = Math.floor(lat) // takes integer value of lat
        const minutesLat = Math.floor((lat-degreesLat) * 60) // takes decimal value of lat then * 60
        const secondsLat = (((lat-degreesLat)*60)%1) * 60

        gpsIfd[piexif.GPSIFD.GPSLatitude] = [
          [degreesLat, 1],
          [minutesLat, 1],
          [secondsLat*1000000, 1000000], // increases precision shown
        ]

        const lon = Math.abs(message.lon)
        const lonRef = message.lon >= 0 ? 'E' : 'W'
        gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lonRef
        
        // converts & puts longitude data (decimal --> dms)
        const degreesLon = Math.floor(lon) // takes integer value of lon
        const minutesLon = Math.floor((lon-degreesLon) * 60) // takes decimal value of lon then * 60
        const secondsLon = (((lon-degreesLon)*60)%1) * 60

        gpsIfd[piexif.GPSIFD.GPSLongitude] = [
          [degreesLon, 1],
          [minutesLon, 1],
          [secondsLon*1000000, 1000000], // increases precision shown
        ]


        gpsIfd[piexif.GPSIFD.GPSDateStamp] = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, ':')

        gpsIfd[piexif.GPSIFD.GPSTimeStamp] = [
          [new Date().getUTCHours(), 1],
          [new Date().getUTCMinutes(), 1],
          [new Date().getUTCSeconds(), 1],
        ]

        // add heading
        //gpsIfd[piexif.GPSIFD.GPSImgDirection] = message.heading

        const exifObj = {GPS: gpsIfd}
        console.log(exifObj)
        const exifBytes = piexif.dump(exifObj)
        out = piexif.insert(exifBytes, jpegData)

        let link = document.createElement('a')
        link.href = out
        let time = new Date()
        let timezoneOffset = time.getTimezoneOffset() * 60000
        let timeString = new Date(time - timezoneOffset)
          .toISOString()
          .replace(':', '_')
          .substring(0, 19)

        link.download = `${camelCaseToTitle(message.camera)}-${timeString}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      break
    }

    default:
      break
  }

  return result
}

export default camerasMiddleware
