import {combineReducers} from "redux";
import {AppReducer} from "src/app";
import {FeedReducer} from "src/feed";

export const createRootReducer = () => combineReducers({
    feed: FeedReducer,
    app: AppReducer,
});
