import {isNumber} from "src/utils";
import * as FeedActionTypes from "./FeedActionTypes";

const MAX_BUFFER_SIZE = 100;
const MAX_BUFFER_TIME = 6000;

const defaultState = {
  buffers: {},
  readyState: WebSocket.CLOSED,
};

export const FeedReducer = (state = defaultState, {type, payload}) => {
  switch (type) {
    case FeedActionTypes.AddChannel: {
      const channel = payload;
      if (state.buffers[channel]) {
        return state;
      }
      const buffer = new Array(MAX_BUFFER_SIZE).fill(null).map(() => ({t: null, y: null, label: null}));
      buffer.pointer = 0;

      return {
        ...state,
        buffers: {
          ...state.buffers,
          // ...{[channel]: []},
          ...{[channel]: buffer},
        },
      };
    }
    break;

    case FeedActionTypes.Opened: {
      return {
        ...state,
        readyState: WebSocket.OPEN,
      }
    }
    break;

    case FeedActionTypes.Closed: {
      return {
        ...state,
        readyState: WebSocket.CLOSED,
      }
    }
    break;

    case FeedActionTypes.Message: {
      const {channel, t, y} = payload;
      const buffer = state.buffers[channel];
      const pointer = buffer.pointer; // Current pointer
      const prevPointPointer = (pointer ? pointer : buffer.length) - 1; // If pointer is at 0, we wrap back around
      const nextPointPointer = (pointer + 1 === buffer.length ? 0 : pointer + 1); // If pointer is at end of array, we wrap back around

      if (!buffer) {
        // Only record messages for streams we have listeners for
        return state;
      }
      if (!isNumber(t) || !isNumber(y)) {
        // Guard against bad data
        return state;
      }

      // Add label to the first data point of each second
      // All other data points will not be labeled
      // This creates a visually persistent label over time
      let label = undefined;
      const curSecond = Math.floor(t / 1000);
      const prevPoint = buffer[prevPointPointer];
      const prevSecond = Math.floor(prevPoint.t / 1000);
      if (!prevSecond || curSecond > prevSecond) {
        label = t;
      }

      // const timeDelta = (t - buffer[0]?.t || t);
      // let i = 0;
      // // Retain only the limited number of seconds of data or total data points
      // if (timeDelta >= MAX_BUFFER_TIME || buffer.length >= MAX_BUFFER_SIZE) {
      //   i += 1;
      // }
      // const newBuffer = buffer.slice(i);
      buffer[pointer].t = t;
      buffer[pointer].y = y;
      buffer[pointer].label = label;

      // Increment our pointer to the now first data point since we've updated this one
      buffer.pointer = nextPointPointer;;

      return state;

    }
    break;

    default:
      return state;
  }
}
