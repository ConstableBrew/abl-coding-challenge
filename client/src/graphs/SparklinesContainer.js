import React, {useLayoutEffect, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {AnimationFrameSelectors} from "src/animation-frame";
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
  const activeChannel = useSelector(AppSelectors.selectActiveChannel);
  const animationFrame = useSelector(AnimationFrameSelectors.selectAnimationFrame);
  const channels = useSelector(FeedSelectors.selectChannelNames);
  const channelData = useSelector(FeedSelectors.selectChannelData);
  const dispatch = useDispatch();

  const dataRef = useRef(
    channels.reduce((map, channel) => {
      map[channel] = channelData[channel];
      return map;
    }, {})
  );

  useLayoutEffect(() => {
    channels.forEach((channel) => {
      dataRef.current[channel] = [...channelData[channel]];
    });
  }, [animationFrame]);

  return (
    <div className="sparklines">
      {
        channels.map((channel) => (
          <Sparkline
            key={`sparkline-${channel}`}
            color={colorSwatch[channel]}
            data={dataRef.current[channel]}
            isActive={activeChannel === channel}
            onClick={() => dispatch(AppActions.setActiveChannel(channel))}
          />
        ))
      }
      
    </div>
  );
}