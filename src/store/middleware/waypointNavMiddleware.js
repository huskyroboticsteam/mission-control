import {messageRover} from '../roverSocketSlice'
import {requestWaypointNav} from '../waypointNavSlice'

const waypointNavMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestWaypointNav.type:
      store.dispatch(
        messageRover({
          message: {
            type: 'waypointNavRequest',
            points: store.getState().waypointNav.points,
          },
        })
      )
      break

    default:
      break
  }

  return result
}

export default waypointNavMiddleware
