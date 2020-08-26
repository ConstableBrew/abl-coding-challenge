import * as AppActionTypes from "./AppActionTypes";
import {FeedActionTypes} from "src/feed";

const defaultState = {
  activeChannel: "",
};

export const AppReducer = (state = defaultState, {type, payload}) => {
  switch (type) {
    case AppActionTypes.SetActiveChannel: {
      const channel = payload;
      return {
        ...state,
        activeChannel: channel,
      };
    }
    break;

    case FeedActionTypes.AddChannel: {
      const channel = payload;
      if (state.activeChannel) {
        return state;
      }
      return {
        ...state,
        activeChannel: channel,
      };
    }
    break;

    case FeedActionTypes.Opened: {
      document.body.classList.remove("loading-spinner");
      return state;
    }
    break;

    case FeedActionTypes.Closed: {
      document.body.classList.add("loading-spinner");
      return state;
    }
    break;

    default:
      return state;
  }
}
