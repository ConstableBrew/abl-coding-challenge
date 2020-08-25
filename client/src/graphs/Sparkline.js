import React, {useRef, useEffect, useLayoutEffect} from "react";
import Chart from "chart.js";
import {sparklineConfig} from "./helpers";
import "./Sparkline.scss";

export const Sparkline = ({isActive, color, data, onClick}) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const config = sparklineConfig();
    config.data.datasets[0].pointBackgroundColor = color;
    const chart = new Chart(ctx, config);
    chartRef.current = chart;
  }, []);

  useLayoutEffect(() => {
    if (chartRef.current) {
      chartRef.current.config.data.datasets[0].data = data;
      chartRef.current.update();
    }
  }, [chartRef, data]);
  
  return (
    <div 
      className={["sparkline", isActive && "active"].filter((x) => x).join(" ")}
      onClick={onClick}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
