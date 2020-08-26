import * as AnimationFrameActionTypes from "./AnimationFrameActionTypes";

export const animationFrame = (timestamp) => ({
  type: AnimationFrameActionTypes.AnimationFrame,
  payload: timestamp,
});
