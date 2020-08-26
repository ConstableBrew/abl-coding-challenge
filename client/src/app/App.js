import React from "react";
import {useSelector} from "react-redux";
import {FeedSelectors} from "src/feed";
import {SparklinesContainer, GraphContainer} from "src/graphs";

export const App = (props) => {
    const readyState = useSelector(FeedSelectors.selectReadyState);
    if (readyState === WebSocket.CLOSED) {
        return null;
    }

    return (
        <React.Fragment>
            <SparklinesContainer />
            <GraphContainer />
        </React.Fragment>
    );
}