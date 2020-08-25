import React, {useRef, useEffect, useLayoutEffect} from "react";
import Chart from "chart.js";
import {graphConfig} from "./helpers";

export const Graph = ({color, data}) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const config = graphConfig();
      const chart = new Chart(ctx, config);
      chartRef.current = chart;
    }
  }, [canvasRef.current]);

  useLayoutEffect(() => {
    if (chartRef.current) {
      chartRef.current.config.data.datasets[0].backgroundColor = color;
      chartRef.current.config.data.datasets[0].borderColor = color;
      chartRef.current.config.data.datasets[0].data = data;
      chartRef.current.config.data.labels = data.map((point) => point.label);
      chartRef.current.update();
    }
  }, [chartRef.current, color, data]);
  
  return <div 
    className="graph"
  >
    <canvas ref={canvasRef} />
  </div>;
}
