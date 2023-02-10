import{
    roverPositionReportReceived
  } from "../teleSlice";
  import { messageReceivedFromRover } from "../roverSocketSlice";

  const telemetryMiddleware = store => next => action => {
    const result = next(action);
    if (action.type === messageReceivedFromRover.type) {
      if (action.payload.message.type === "poseReport") {
        const { orientW, orientX, orientY, orientZ, posX, posY, posZ, timestamp } = action.payload.message;
        store.dispatch(roverPositionReportReceived({
          poseReport: {
            orientW,
            orientX,
            orientY,
            orientZ,
            posX,
            posY,
            posZ,
            timestamp
          }
        }));
      }
    }
  
    return result;
  }
  
  export default telemetryMiddleware;