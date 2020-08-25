import * as AppActionTypes from "./AppActionTypes";

const defaultState = {
  activeChannel: "A",
};

export const AppReducer = (state = defaultState, {type, payload}) => {
  switch (type) {
    case AppActionTypes.SetActiveChannel: {
      return {
        ...state,
        activeChannel: payload,
      };
    }
    break;

    default:
      return state;
  }
}
