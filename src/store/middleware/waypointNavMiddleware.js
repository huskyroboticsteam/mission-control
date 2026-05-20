import {messageRover} from '../roverSocketSlice'
import {requestWaypointNav} from '../waypointNavSlice'

const waypointNavMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestWaypointNav.type:
      store.dispatch(
        messageRover({
          message: (() => {
            const waypointNav = store.getState().waypointNav
            const pts = waypointNav.points ?? []
            return {
              type: 'waypointNavRequest',
              points: pts.map(({lat, lon}) => [lat, lon]),
              tag: waypointNav.tag ?? '',
              circleMode: waypointNav.circleMode ?? false,
              radius: waypointNav.radius ?? 0,
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
