import Chart from "chart.js";
import {isNumber} from "src/utils";
import moment from "moment";

const MAX_BUFFER_SIZE = 300;
let ws;
let focusedStream = "A";
const buffer = {};
const streamStyles = {
  A: "#cc3333",
  B: "#33cc33",
  C: "#3333cc",
};

const onError = (event) => {
  console.error("Socket Error, re-establishing connection...");
  document.body.classList.add("loading-spinner");
  setTimeout(() => {
    ws = connect();
  }, 1000)
};

const onMessage = ({data}) => {
  const {sourceName, ts: t, val: y} = JSON.parse(event.data);

  if (isNumber(t) && isNumber(y)) {
    let sourceBuffer = buffer[sourceName];
    if (!sourceBuffer) {
      const emptyPlaceholder = {t: Math.floor(t / 1000) * 1000, y: undefined};
      sourceBuffer = new Array(MAX_BUFFER_SIZE).fill(emptyPlaceholder);
      buffer[sourceName] = sourceBuffer;
    }

    const previous = sourceBuffer[sourceBuffer.length - 1] || 0;
    const label = Math.floor(t / 1000) !== Math.floor(previous.t / 1000) 
      ? moment.unix(t / 1000).format("h:mm:ss a") 
      : undefined;
    label && console.log(label);
    sourceBuffer.push({label, t, y});
    if (sourceBuffer.length > MAX_BUFFER_SIZE) {
      sourceBuffer.shift();
    }
    if (sourceName === focusedStream) {
      requestAnimationFrame(drawPrimaryDisplay);
    }
  } else {
    console.info("Rejecting data:", {t, y});
  }
};

const onOpen = () => {
  document.body.classList.remove("loading-spinner");
}

const connect = () => {
  ws = new WebSocket("ws://localhost:8080");
  ws.onerror = onError;
  ws.onmessage = onMessage;
  ws.onopen = onOpen;
};

let primaryChart;
let prevTimestamp = 0;
const primaryDisplay = document.getElementById("primary-display").getContext("2d");
const drawPrimaryDisplay = (timestamp) => {
  if (timestamp <= prevTimestamp) {
    // Duplicate call to requestAnimationFrame
    return;
  }
  prevTimestamp = timestamp;
  const STATE_OPEN = 1;
  if (ws?.readyState === STATE_OPEN) {
    const data = buffer[focusedStream];
    if (!primaryChart) {
      primaryChart = new Chart(primaryDisplay, {
        data: {
          datasets: [{
            label: focusedStream,
            backgroundColor: streamStyles[focusedStream],
            borderColor: streamStyles[focusedStream],
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
          responsiveAnimationDuration: 0,
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
    }
    try {
      // primaryChart.config.data.labels = data.map((point) => point?.label);
      primaryChart.config.data.datasets[0].data = data;
      primaryChart.update();
    }
    catch (err) {
      console.error('Error when drawing chart:', err);
      // Chart.js occasionally has problems calculating the axis labels and ticks to draw in it's autoSkip calculations
      // Work around the problem by not drawing any of the ticks for a short time then turn them back on after a short delay.
      primaryChart.config.options.scales.xAxes[0].display = false;
      primaryChart.update();
      setTimeout(() => (primaryChart.config.options.scales.xAxes[0].display = true), 250);
      
    }
  }
};



setTimeout(connect, 1000);
