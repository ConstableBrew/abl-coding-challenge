import React, {useLayoutEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {AnimationFrameSelectors} from "src/animation-frame";
import {AppSelectors} from "src/app";
import {FeedSelectors} from "src/feed";
import {Graph} from "./Graph";
import {formatLabel} from "./helpers";

// TODO import colors form scss, don't hard code channel name
const colorSwatch = {
  A: "#cc3333",
  B: "#33cc33",
  C: "#3333cc",
};

export function GraphContainer() {
  const animationFrame = useSelector(AnimationFrameSelectors.selectAnimationFrame);
  const activeChannel = useSelector(AppSelectors.selectActiveChannel);
  const channelData = useSelector(FeedSelectors.selectChannelData);
  const dataRef = useRef(channelData[activeChannel]);
  const labelRef = useRef(channelData[activeChannel].map(() => undefined));

  useLayoutEffect(() => {
    const buffer = channelData[activeChannel];
    dataRef.current = [
      ...buffer.slice(buffer.pointer, buffer.length),
      ...buffer.slice(0, buffer.pointer),
    ];
    labelRef.current = dataRef.current.map((point, index) => point 
      && (
        point.label && point.label  ||
        index === 0 && point.t // label the first point
      ) || undefined
    );
  }, [animationFrame]);

  return (
    <Graph
      animationFrame={animationFrame}
      color={colorSwatch[activeChannel]}
      data={dataRef.current}
      labels={labelRef.current}
    />
  );
}