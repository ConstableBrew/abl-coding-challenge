import React from "react";
import {SparklinesContainer, GraphContainer} from "src/graphs";

export const App = (props) => {
    return (
        <React.Fragment>
            <SparklinesContainer />
            <GraphContainer />
        </React.Fragment>
    );
}