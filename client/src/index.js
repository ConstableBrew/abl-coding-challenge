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
  // Remove .active from each of the sparkline graphs and add .active to the one focused on
  streamMap.forEach((config, name) => {
    console.log('streamMap', name, sourceName)
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


// Updates chart's data and then redraws the graph
const drawChart = (sourceName, chartObject) => {
  const data = feed.getData(sourceName);
  try {
    if (updatedCharts[sourceName]) {
      chartObject.config.data.datasets[0].data = data;
      chartObject.update();
    }
  }
  catch (err) {
    console.error('Error when drawing chart:', err);
    // Chart.js occasionally has problems calculating the axis labels and ticks to draw in it's autoSkip calculations
  }
  finally {
    updatedCharts[sourceName] = false;
  }
};

const drawCharts = (timestamp) => {
  if (timestamp <= drawCharts.timestamp) {
    // Duplicate call to requestAnimationFrame
    return;
  }
  drawCharts.timestamp = timestamp;
  drawChart(focusedStream, mainChart);
  streamMap.forEach((config) => drawChart(config.sourceName, config.chart));
};
drawCharts.timestamp = 0;

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
