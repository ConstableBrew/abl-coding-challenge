import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {App} from "src/components/App";
import {configureStore} from "./configureStore";

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);


import {TimeSeriesFeed} from "src/feed";
import {chartFactory, sparklineFactory} from "src/graphs";

let focusedStream = "A";
const streamMap = new Map([
  ["A", {
    sourceName: "A",
    id: "primary-sparkline",
    color: "#cc3333",
    background: "#330e0e",
  }],
  ["B", {
    sourceName: "B",
    id: "secondary-sparkline",
    color: "#33cc33",
    background: "#0e330e",
  }],
  ["C", {
    sourceName: "C",
    id: "tertiary-sparkline",
    color: "#3333cc",
    background: "#0e0e33",
  }],
]);

const onOpen = () => {
  document.body.classList.remove("loading-spinner");
}

const onClose = () => {
  document.body.classList.add("loading-spinner");
}

const feed = new TimeSeriesFeed({
  url: "ws://localhost:8080/",
  eventKey: "sourceName",
  onOpen,
  onClose,
});


const setFocus = (sourceName) => {
  focusedStream = sourceName;
  // Remove .active from each of the sparkline graphs and add .active to the one focused one
  streamMap.forEach((config, name) => {
    if (name === sourceName) {
      document.getElementById(config.id).classList.add('active');
      mainChart.config.data.datasets[0].label = sourceName;
      mainChart.config.data.datasets[0].backgroundColor = config.color;
      mainChart.config.data.datasets[0].borderColor = config.color;
    } else {
      document.getElementById(config.id).classList.remove('active');
    }
  });
};

// Create sparklines and save chart objects to the streamMap configs
streamMap.forEach((config) => {
  config.chart = sparklineFactory({
    ...config,
    onMouseup: setFocus,
  });
});

// Creat main chart
const mainChart = chartFactory({id: "main-display"});

// Tracks which charts have received data since the last render
const updatedCharts = {};


// Refreshes a single chart's data and then redraws the graph
const drawChart = ({sourceName, chartObject}) => {
  const data = feed.getData(sourceName);
  try {
    chartObject.config.data.datasets[0].data = data;
    chartObject.config.data.labels = data.map((point) => point.label);
    chartObject.update();
  }
  catch (err) {
    console.error('Error when drawing chart:', err);
    // Chart.js occasionally has problems calculating the axis labels and ticks to draw in it's autoSkip calculations
  }
};

// Primary animation loop
const drawCharts = (timestamp) => {
  if (timestamp <= drawCharts.timestamp) {
    // Duplicate call to requestAnimationFrame
    return;
  }
  drawCharts.timestamp = timestamp;

  // Draw only charts that have changed since last render
  for (const sourceName in updatedCharts) {
    if (updatedCharts[sourceName]) {
      const config = streamMap.get(sourceName)
      // Draw the sparkline charts
      drawChart({
        sourceName: config.sourceName,
        chartObject: config.chart,
      });

      // The main chart also needs to be updated
      if (focusedStream === sourceName) {
        drawChart({
          sourceName,
          chartObject: mainChart,
        });
      }
      updatedCharts[sourceName] = false;
    }
  }
};
drawCharts.timestamp = 0;

// Sets tracking flag for which charts have been updated since the last render and triggers the next render
const flagChartForRender = (sourceName) => {
  updatedCharts[sourceName] = true;
  requestAnimationFrame(drawCharts);
}

const feedSubscriptions = {
  primaryStream: feed.subscribe("A", () => flagChartForRender("A")),
  secondaryStream: feed.subscribe("B", () => flagChartForRender("B")),
  tertiaryStream: feed.subscribe("C", () => flagChartForRender("C")),
};

setFocus("A");
