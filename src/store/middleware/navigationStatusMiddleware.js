import { messageReceivedFromRover } from "../roverSocketSlice";
import { navigationStatusReceived } from "../navigationStatusSlice";

const navigationStatusMiddleware = store => next => action => {
    const result = next(action);

    if (action.type === messageReceivedFromRover.type) {
        const { message } = action.payload;
        if (message.type === "autonomousNavStatusReport") {
            store.dispatch(navigationStatusReceived({
                status: message.status,
                distanceToTarget: message.distanceToTarget,
                errorMessage: message.errorMessage
            }));
        }
    }
    return result;
};

export default navigationStatusMiddleware;