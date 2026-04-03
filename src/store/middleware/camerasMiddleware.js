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
import {piexif} from 'piexifjs'
import {Quaternion, Euler} from '@math.gl/core'

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
            camera: action.payload.camera,
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
            camera: action.payload.camera,
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
            camera: action.payload.camera,
          },
        })
      )
      break
    }

    case roverConnected.type: {
      // Inform the rover of camera streams we would like to receive when we
      // connect.
      const cameras = store.getState().cameras
      Object.keys(cameras).forEach((camera) => {
        if (cameras[camera].isStreaming) {
          store.dispatch(
            messageRover({
              message: {
                type: 'cameraStreamOpenRequest',
                camera: camera,
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
      Object.keys(cameras).forEach((camera) => {
        if (cameras[camera].isStreaming && cameras[camera].frameData !== null) {
          store.dispatch(
            cameraStreamDataReportReceived({
              camera: camera,
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
            camera: message.camera,
            frameData: message.data,
          })
        )
      } else if (message.type === 'cameraFrameReport' && message.data !== '') {
        let jpegData = `data:image/jpeg;base64,${message.data}`
        let out = jpegData

        // Fits the telemetry(position/gps) data into exif metadata
        let gpsIfd = {}

        // put altitude, max precision to prevent pack error @ tallest point in Earth
        gpsIfd[piexif.GPSIFD.GPSAltitude] = [message.alt * 100000, 100000]

        // converts & puts latitude data (decimal --> dms)
        const lat = Math.abs(message.lat)
        const latRef = message.lat >= 0 ? 'N' : 'S'
        gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = latRef

        let degreesLat = Math.floor(lat) // takes integer value of lat
        let minutesLat = Math.floor((lat - degreesLat) * 60) // takes decimal value of lat then * 60
        let secondsLat = (((lat - degreesLat) * 60) % 1) * 60

        gpsIfd[piexif.GPSIFD.GPSLatitude] = [
          [degreesLat, 1],
          [minutesLat, 1],
          [secondsLat * 1000000, 1000000], // increases precision shown
        ]

        const lon = Math.abs(message.lon)
        const lonRef = message.lon >= 0 ? 'E' : 'W'
        gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lonRef

        // converts & puts longitude data (decimal --> dms)
        let degreesLon = Math.floor(lon) // takes integer value of lon
        let minutesLon = Math.floor((lon - degreesLon) * 60) // takes decimal value of lon then * 60
        let secondsLon = (((lon - degreesLon) * 60) % 1) * 60

        gpsIfd[piexif.GPSIFD.GPSLongitude] = [
          [degreesLon, 1],
          [minutesLon, 1],
          [secondsLon * 1000000, 1000000], // increases precision shown
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

        // Heading
        const orientX = message.orientX
        const orientY = message.orientY
        const orientZ = message.orientZ
        const orientW = message.orientW
        let quat = new Quaternion(orientX, orientY, orientZ, orientW)
        let rpy = new Euler().fromQuaternion(quat, Euler.ZYX)
        let yaw = Math.round((rpy.yaw * 180) / Math.PI)
        let heading = yaw != null ? -yaw : undefined

        // heading is from -180 to 180 but to format it into metadata, has
        // to be 0 --> 360 so we remap the negative values of heading
        if (heading < 0) {
          heading += 360
        }

        gpsIfd[piexif.GPSIFD.GPSImgDirection] = [heading, 1]
        gpsIfd[piexif.GPSIFD.GPSImgDirectionRef] = 'M' //magnetic north

        const exifObj = {GPS: gpsIfd}
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
