import Chart from "chart.js";
import {createCanvasAndGetCtx} from "./helpers";

/*
 * Factory to create the large main graph
 */
export const chartFactory = ({id}) => {
  const ctx = createCanvasAndGetCtx(id);
  const chart = new Chart(ctx, {
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
          distribution: "linear",
          offset: false,
          gridLines: {
            color: "#d3d3d3",
          },
          ticks: {
            fontColor: "#d3d3d3",
            major: {
              enabled: true,
              fontStyle: "bold",
            },
            // source: "auto",
            source: "labels",
            autoSkip: false,
            maxTicksLimit: 5,
            minRotation: 15,
            maxRotation: 15,
            sampleSize: 20,
          },
          time: {
            unit: "second",
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
  return chart;
};
