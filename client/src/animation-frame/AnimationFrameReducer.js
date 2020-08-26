import * as AnimationFrameActionTypes from "./AnimationFrameActionTypes";

const defaultState = {
  timestamp: 0,
};

export const AnimationFrameReducer = (state = defaultState, {type, payload}) => {
  switch (type) {
    case AnimationFrameActionTypes.AnimationFrame: {
      const timestamp = payload;
      return {
        ...state,
        timestamp,
      };
    }
    break;

    default:
      return state;
  }
}
