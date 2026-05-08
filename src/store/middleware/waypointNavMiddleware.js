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
              radius: first.radius ?? 0,
              //points: pts.map(({lat, lon}) => ({latitude: lat, longitude: lon})),
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
