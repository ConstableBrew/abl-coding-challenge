import React from "react";
import {useSelector} from "react-redux";
import {AppSelectors} from "src/app";
import {FeedSelectors} from "src/feed";

// TODO import colors form scss, don't hard code channel name
const colorSwatch = {
  A: "#cc3333",
  B: "#33cc33",
  C: "#3333cc",
};

export function GraphContainer() {
  const activeChannel = useSelector(AppSelectors.selectActiveChannel);
  const data = useSelector(FeedSelectors.selectChannelData(channel));

  return (
    <Graph
      color={colorSwatch[activeChannel]}
      data={data}
    />
  );
}