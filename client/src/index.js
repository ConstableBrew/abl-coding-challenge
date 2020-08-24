import Chart from "chart.js";
import {TimeSeriesFeed} from "src/feed";

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

const createCanvasAndGetCtx = (id) => {
  const canvas = document.createElement("canvas");
  const container = document.getElementById(id);
  container.appendChild(canvas);
  return canvas.getContext("2d");
}

const mainDisplayBox = createCanvasAndGetCtx("main-display");
const mainChart = new Chart(mainDisplayBox, {
  data: {
    datasets: [{
      data: [],
      type: "line",
      pointRadius: 0,
      fill: false,
      lineTension: 0,
      borderWidth: 2,
    }],
  },
  options: {
    animation: {
      duration: 0,
    },
    events: [],
    hover: {
      animationDuration: 0,
    },
    line: {
      tension: 0,
    },
    legend: {
      display: false,
    },
    responsiveAnimationDuration: 0,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: "time",
        distribution: "series",
        offset: true,
        gridLines: {
          color: "#d3d3d3",
        },
        ticks: {
          fontColor: "#d3d3d3",
          major: {
            enabled: true,
            fontStyle: "bold",
          },
          source: "data",
          autoSkip: true,
          autoSkipPadding: 75,
          maxTicksLimit: 5,
          minRotation: 0,
          maxRotation: 0,
          sampleSize: 10,
          time: {
            unit: "seconds",
          },
        },
      }],
      yAxes: [{
        gridLines: {
          drawBorder: false,
        },
        ticks: {
          fontColor: "#d3d3d3",
        },
      }],
    },
    spanGaps: false,
    style: {
      backgroundColor: "#000000",
    },
  },
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

const createSparkline = ({id, sourceName, color, background}) => {
  const container = document.getElementById(id);
  container.addEventListener("mouseup", () => console.log('setFocus', sourceName) || setFocus(sourceName));

  const displayBox = createCanvasAndGetCtx(id);
  const chart = new Chart(displayBox, {
    data: {
      datasets: [{
        data: [],
        type: "line",
        pointBackgroundColor: color,
        pointRadius: 1,
        pointStyle: "rect",
        showLine: false,
      }],
    },
    options: {
      animation: {
        duration: 0,
      },
      events: [],
      hover: {
        animationDuration: 0,
      },
      line: {
        tension: 0,
      },
      legend: {
        display: false,
      },
      responsiveAnimationDuration: 0,
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [{
          type: "time",
          distribution: "series",
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
          ticks: {
            display: false,
            tickMarkLength: 0,
          },
        }],
        yAxes: [{
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
          ticks: {
            display: false,
          },
        }],
      },
      spanGaps: false,
      style: {
        backgroundColor: background,
      },
    },
  });
  return chart;
};

// Create sparklines and save chart objects to the streamMap configs
streamMap.forEach((config) => (config.chart = createSparkline(config)));

const drawChart = (sourceName, chartObject) => {
  const data = feed.getData(sourceName);
  try {
    chartObject.config.data.datasets[0].data = data;
    chartObject.update();
  }
  catch (err) {
    console.error('Error when drawing chart:', err);
    // Chart.js occasionally has problems calculating the axis labels and ticks to draw in it's autoSkip calculations
  }
};

const drawMainChart = (sourceName) => {
  const data = feed.getData(sourceName);
  try {
    mainChart.config.data.datasets[0].data = data;
    mainChart.update();
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
  drawChart(focusedStream, mainChart);
  streamMap.forEach((config) => drawChart(config.sourceName, config.chart));
};
drawCharts.timestamp = 0;

const feedSubscriptions = {
  primaryStream: feed.subscribe("A", () => requestAnimationFrame(drawCharts)),
  secondaryStream: feed.subscribe("B", () => requestAnimationFrame(drawCharts)),
  tertiaryStream: feed.subscribe("C", () => requestAnimationFrame(drawCharts)),
};

setFocus("A");
