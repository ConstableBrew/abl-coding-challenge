import Chart from "chart.js";
import {createCanvasAndGetCtx} from "./helpers";

export const sparklineFactory = ({id, sourceName, color, background, onMouseup}) => {
  const container = document.getElementById(id);
  container.addEventListener("mouseup", () => onMouseup(sourceName));

  const ctx = createCanvasAndGetCtx(id);
  const chart = new Chart(ctx, {
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
            fontSize: 0,
          },
        }],
        yAxes: [{
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
          ticks: {
            display: false,
            fontSize: 0,
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
