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

// Adds label to last data point if the span between labels is sufficient
const updateLabels = (data) => {
  data.forEach((point, i) => {
    if (!i) {
      return;
    }
    const curSecond = Math.floor(point.t / 1000);
    const prevPoint = data[i - 1];
    const prevSecond = Math.floor(prevPoint.t / 1000);
    if (prevPoint && curSecond > prevSecond) {
      point.label = point.t;
    }
  });

  // Ensure first point always has a label
  const first = data[0];
  first.label = first.t;
//   const last = data[data.length - 1];
//   const delta = last.t - first.t;
// 
//   if (delta > ONE_SECOND) {
//     const expectedLabelCount = Math.min(Math.floor(delta / ONE_SECOND), 3);
//     const stepSize = Math.floor(data.length / expectedLabelCount);
//     let noLabelExists = true;
//     let i = Math.max(0, data.length - stepSize);
//     while (noLabelExists && i < data.length) {
//       noLabelExists = !data[i].label;
//       i += 1;
//     }
//     if (noLabelExists) {
//       last.label = last.t;
//     }
//   }
// 
};

// Updates chart's data and then redraws the graph
const drawChart = ({sourceName, chartObject}) => {
  const data = feed.getData(sourceName);
  updateLabels(data);
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

const drawCharts = (timestamp) => {
  if (timestamp <= drawCharts.timestamp) {
    // Duplicate call to requestAnimationFrame
    return;
  }
  drawCharts.timestamp = timestamp;

  for (const sourceName in updatedCharts) {
    if (updatedCharts[sourceName]) {
      const config = streamMap.get(sourceName)
      drawChart({
        sourceName: config.sourceName,
        chartObject: config.chart,
      });
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
