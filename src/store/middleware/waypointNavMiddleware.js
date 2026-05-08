import {messageRover} from '../roverSocketSlice'
import {requestWaypointNav} from '../waypointNavSlice'

const waypointNavMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestWaypointNav.type:
      store.dispatch(
        messageRover({
          message: (() => {
            const pts = store.getState().waypointNav.points
            const first = pts[0] ?? {}
            return {
              type: 'waypointNavRequest',
              tag: first.tag ?? '',
              circleMode: first.circleMode ?? false,
              points: pts.map(({lat, lon, radius}) => ({latitude: lat, longitude: lon, radius})),
            }
          })(),
        })
      )
      break

    default:
      break
  }

  return result
}

export default waypointNavMiddleware
