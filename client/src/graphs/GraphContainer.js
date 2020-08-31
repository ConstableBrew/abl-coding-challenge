import React, {useLayoutEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {AnimationFrameSelectors} from "src/animation-frame";
import {AppSelectors} from "src/app";
import {FeedSelectors} from "src/feed";
import {Graph} from "./Graph";

// TODO import colors form scss
const colorSwatch = {
  A: "#cc3333",
  B: "#33cc33",
  C: "#3333cc",
};

export function GraphContainer() {
  const animationFrame = useSelector(AnimationFrameSelectors.selectAnimationFrame);
  const activeChannel = useSelector(AppSelectors.selectActiveChannel);
  const data = useSelector(FeedSelectors.selectChannelData)[activeChannel];
  const schema = useSelector(FeedSelectors.selectChannelSchema)[activeChannel];
  const dataRef = useRef(data);

  useLayoutEffect(() => {
    dataRef.current = data;
  }, [animationFrame]);

  return (
    <Graph
      color={colorSwatch[activeChannel]}
      data={dataRef.current}
      schema={schema}
    />
  );
}