import {store} from "src/store";
import * as AnimationFrameActions from "./AnimationFrameActions";

const maxFPS = 60;
const minDelta = 1000 / maxFPS;
let prevTimestamp = 0;

const updateAnimationFrameTimestamp = (timestamp) => {
  if ((timestamp - prevTimestamp) >= minDelta) {
    prevTimestamp = timestamp;
    store.dispatch(AnimationFrameActions.animationFrame(timestamp));
  }
  window.requestAnimationFrame(updateAnimationFrameTimestamp);
};

window.requestAnimationFrame(updateAnimationFrameTimestamp);
