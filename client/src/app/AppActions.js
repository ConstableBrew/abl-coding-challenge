import * as AppActionTypes from "./AppActionTypes";

export const setActiveChannel = (channelName) => ({
    type: AppActionTypes.SetActiveChannel,
    payload: channelName,
});
