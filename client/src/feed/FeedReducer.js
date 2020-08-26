import {isNumber} from "src/utils";
import * as FeedActionTypes from "./FeedActionTypes";

const MAX_BUFFER_SIZE = 1000;
const MAX_BUFFER_TIME = 6000;

const defaultState = {
  buffers: {},
};

export const FeedReducer = (state = defaultState, {type, payload}) => {
  switch (type) {
    case FeedActionTypes.AddChannel: {
      const channel = payload;
      if (state.buffers[channel]) {
        return state;
      }

      return {
        ...state,
        buffers: {
          ...state.buffers,
          ...{[channel]: []},
        },
      };
    }
    break;

    case FeedActionTypes.Message: {
      const {channel, t, y} = payload;
      const buffer = state.buffers[channel];

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
      if (buffer.length) {
        const curSecond = Math.floor(t / 1000);
        const prevPoint = buffer[buffer.length - 1];
        const prevSecond = Math.floor(prevPoint.t / 1000);
        if (curSecond > prevSecond) {
          label = t;
        }
      }

      buffer.push();
      const timeDelta = (t - buffer[0]?.t || t);
      let i = 0;
      // Retain only the limited number of seconds of data or total data points
      if (timeDelta >= MAX_BUFFER_TIME || buffer.length >= MAX_BUFFER_SIZE) {
        i += 1;
      }
      const newBuffer = buffer.slice(i);
      newBuffer.push({t, y, label});

      // Ensure first point always has a label
      newBuffer[0] = {
        ...newBuffer[0],
        label: newBuffer[0].t,
      };

      return {
        ...state,
        buffers: {
          ...state.buffers,
          [channel]: newBuffer,
        },
      };

    }
    break;

    default:
      return state;
  }
}
