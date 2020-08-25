import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {AppActions, AppSelectors} from "src/app";
import {FeedSelectors} from "src/feed";
import "./SparklinesContainer.scss";

export function SparklinesContainer() {
  const channels = useSelector(FeedSelectors.selectChannelNames);
  const activeChannel = useSelector(selectActiveChannel);
  const dispatch = useDispatch();

  return (
    <div className="sparklines">
      {
        channels.map((channelName, i) => (
          <Sparkline
            color={colorSwatch[i]}
            data={useSelector(FeedSelectors.selectChannelData(channelName))}
            isActive={activeChannel === channelName}
            onClick={() => dispatch(AppActions.setActiveChannel(channelName))}
          />
        ))
      }
      
    </div>
  )
}