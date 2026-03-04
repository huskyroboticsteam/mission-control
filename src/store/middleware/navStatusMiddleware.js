import {roverStatusReportReceived} from '../navStatusSlice'
import {messageReceivedFromRover} from '../roverSocketSlice'

const navStatusMiddleware = (store) => (next) => (action) => {
  const result = next(action)
  if (action.type === messageReceivedFromRover.type) {
    const {message} = action.payload
    if (message.type === 'roverStatusReport') {
      const {currTarget, relativeDistance, roverStatus} = message
      store.dispatch(
        roverStatusReportReceived({
          currTarget,
          relativeDistance,
          roverStatus,
        })
      )
    }
  }

  return result
}

export default navStatusMiddleware
