import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {AppActions, AppSelectors} from "src/app";
import {FeedSelectors} from "src/feed";
import {Sparkline} from "./Sparkline";
import "./SparklinesContainer.scss";

// TODO import colors form scss, don't hard code channel name
const colorSwatch = {
  A: "#cc3333",
  B: "#33cc33",
  C: "#3333cc",
};

export function SparklinesContainer() {
  const channels = useSelector(FeedSelectors.selectChannelNames);
  const activeChannel = useSelector(AppSelectors.selectActiveChannel);
  const dispatch = useDispatch();

  return (
    <div className="sparklines">
      {
        channels.map((channel) => (
          <Sparkline
            key={`sparkline-${channel}`}
            color={colorSwatch[channel]}
            data={useSelector(FeedSelectors.selectChannelData(channel))}
            isActive={activeChannel === channel}
            onClick={() => dispatch(AppActions.setActiveChannel(channel))}
          />
        ))
      }
      
    </div>
  );
}