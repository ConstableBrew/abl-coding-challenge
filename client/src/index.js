import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {store} from "src/store";
import {App} from "src/app";
import {Feed, FeedActions} from "src/feed";
import "src/animation-frame/AnimationFrame";

const datasourceSchema = () => [
    {
        "name": "y",
        "type": "measure",
        "defAggFn": "avg",
    },
    {
        "name": "t",
        "type": "dimension",
        "subtype": "temporal",
    },
];

const feed = new Feed({url: "ws://localhost:8080/"});
store.dispatch(FeedActions.addChannel({channel: "A", schema: datasourceSchema()}));
store.dispatch(FeedActions.addChannel({channel: "B", schema: datasourceSchema()}));
store.dispatch(FeedActions.addChannel({channel: "C", schema: datasourceSchema()}));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
