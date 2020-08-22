import Chart from "chart.js";
import {isNumber} from 'src/utils';

const MAX_BUFFER_SIZE = 1024;
let ws;
let focusedStream = "A";
const buffer = {
  A: [],
  B: [],
  C: [],
};

const onError = (event) => {
  console.error("Socket Error, re-establishing connection...");
  document.body.classList.remove("loading-spinner");
  setTimeout(() => {
    ws = connect();
  }, 1000)
};

const onMessage = ({data}) => {
  const {sourceName, ts: t, val: y} = JSON.parse(event.data);
  const sourceBuffer = buffer[sourceName];
  if (sourceBuffer) {
    if (isNumber(t) && isNumber(y)) {
      sourceBuffer.push({t, y});
      if (sourceBuffer.length > MAX_BUFFER_SIZE) {
        sourceBuffer.shift();
      }
      if (sourceName === focusedStream) {
        requestAnimationFrame(drawPrimaryDisplay);
      }
    } else {
      console.info("Rejecting data:", {t, y});
    }
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
const primaryDisplay = document.getElementById("primary-display").getContext("2d");
const drawPrimaryDisplay = () => {
  const STATE_OPEN = 1;
  if (ws?.readyState === STATE_OPEN) {
    const data = buffer[focusedStream];
    if (!primaryChart) {
      primaryChart = new Chart(primaryDisplay, {
        data: {
          datasets: [{
            label: focusedStream,
            backgroundColor: "#cc3333",
            borderColor: "#cc3333",
            data,
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
              ticks: {
                major: {
                  enabled: true,
                  fontStyle: "bold",
                },
                source: "data",
                autoSkip: true,
                autoSkipPadding: 75,
                minRotation: 0,
                maxRotation: 0,
                sampleSize: 5,
              },
            }],
            yAxes: [{
              gridLines: {
                drawBorder: false,
              },
            }]
          },
        },
      });
    } else {
      primaryChart.config.data.datasets[0].data = data;
      primaryChart.update();
    }
  }
};



setTimeout(connect, 1000);
