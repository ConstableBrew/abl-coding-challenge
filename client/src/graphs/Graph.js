import React, {useRef, useEffect, useLayoutEffect} from "react";
import muze from "@chartshq/muze";
import {graphConfig} from "./helpers";
import "./Graph.scss";

export const Graph = ({color, data, schema}) => {
  const containerRef = useRef(null);
  const graphRef = useRef({});

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const prepareGraph = async () => {
      const env = await muze();
      const canvas = env.canvas();
      const ActionModel = muze.ActionModel;
      const {width, height} = containerRef.current.getBoundingClientRect();

      canvas
        .width(width|0)
        .height(height|0)
        // .mount(containerRef.current);

      ActionModel
        .for(canvas)
        .dissociateBehaviour(
          ['select', 'click'],
          ['highlight', 'hover']
        )
        .dissociateSideEffect(
          ['tooltip', 'highlight'],
          ['selectionBox', 'brush']
        );
      graphRef.current.env = env;
      graphRef.current.canvas = canvas;
    };
     
    prepareGraph()
      .catch(console.error.bind(console));
  }, [containerRef.current]);


  useLayoutEffect(() => {
    const drawGraph = async () => {
      if (!graphRef?.current?.canvas || !data?.length || !schema) return;

      const DataModel = await muze.DataModel.onReady();
      const formattedData = await DataModel.loadData(data, schema);
      const dm = new DataModel(formattedData);
      const {canvas} = graphRef.current;

      canvas
        .data(dm)
        .rows(["y"])
        .columns(["t"])
        .mount(containerRef.current);
      graphRef.current.dm = dm;
    }
     
    drawGraph()
      .catch(console.error.bind(console));
  }, [color, data, schema]);
  
  return <div 
    className="graph"
    ref={containerRef}
  >
  </div>;
}
