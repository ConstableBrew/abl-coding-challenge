const labelFormatter = new Intl.DateTimeFormat({hour: "numeric", minute: "numeric", second: "numeric"});
export const formatLabel = (timestamp) => {
  try {
    return labelFormatter.format(new Date(timestamp));
  }
  catch (err) {
    return timestamp;
  }
};

export const graphConfig = () => ({
  data: {
    datasets: [{
      data: [],
      type: "line",
      pointRadius: 2,
      fill: false,
      lineTension: 0,
      borderWidth: 2,
      pointStyle: "rect",
      showLine: true,
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

export const sparklineConfig = () => ({
  data: {
    datasets: [{
      data: [],
      type: "line",
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
        distribution: "linear",
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
  },
});

