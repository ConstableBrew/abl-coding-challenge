import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {store} from "src/store";
import {App} from "src/app";
import {Feed, FeedActions} from "src/feed";

const feed = new Feed({url: "ws://localhost:8080/"});
store.dispatch(FeedActions.addChannel("A"));
store.dispatch(FeedActions.addChannel("B"));
store.dispatch(FeedActions.addChannel("C"));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
