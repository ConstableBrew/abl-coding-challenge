import * as FeedActionTypes from "./FeedActionTypes";

export const feedMessage = ({channel, t, y}) => ({
    type: FeedActionTypes.Message,
    payload: {
        channel,
        t,
        y,
    },
});

export const feedOpened = () => ({
    type: FeedActionTypes.Opened,
});

export const feedClosed = () => ({
    type: FeedActionTypes.Closed,
});

export const addChannel = (channel) => ({
    type: FeedActionTypes.AddChannel,
    payload: channel,
});