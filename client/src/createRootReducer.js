import {combineReducers} from "redux";
import {AnimationFrameReducer} from "src/animation-frame";
import {AppReducer} from "src/app";
import {FeedReducer} from "src/feed";

export const createRootReducer = () => combineReducers({
    animationFrame: AnimationFrameReducer,
    app: AppReducer,
    feed: FeedReducer,
});
