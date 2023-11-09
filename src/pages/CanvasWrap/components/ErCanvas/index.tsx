import { Cell, Graph } from "@antv/x6";
import styles from "./index.module.less";
import { useMount } from "ahooks";
import React, { useEffect, useRef } from "react";
import cuid from "cuid";
import ER from "./components/ER";
import { EntityDetail } from "./shared";
import { SizeInfo } from "rc-resize-observer";

interface ErCanvasProps {
  canvasData?: {
    cells: Cell.Properties[];
  };
  entityDetail?: EntityDetail;
  style?: React.CSSProperties;
  size?: SizeInfo;
}

const ErCanvas = (props: ErCanvasProps) => {
  const { canvasData, entityDetail, style, size } = props;
  const graphRef = useRef<Graph>(null);
  const containerId = `graph-${cuid.slug()}`;
  const erRef = useRef(null);

  const initGraph = () => {
    const container = document.getElementById(containerId);
    const graph = new Graph({
      container: container,
      grid: {
        size: 10, // 网格大小 10px
        visible: true, // 渲染网格背景
      },
      scroller: true,
      autoResize: true,
      mousewheel: {
        enabled: true,
        modifiers: ["ctrl", "meta"],
        minScale: 0.3,
        maxScale: 3,
      },
      highlighting: {
        embedding: {
          name: "stroke",
          args: {
            padding: -1,
            attrs: {
              stroke: "#4e75fd",
            },
          },
        },
      },
    });

    graphRef.current = graph;
    erRef.current = new ER({ graph, container });
  };

  useMount(() => {
    initGraph();
  });

  useEffect(() => {
    size && graphRef.current?.resize(size.width, size.height);
  }, [size]);

  return <div className={styles.ErCanvas} style={style} id={containerId}></div>;
};
export default ErCanvas;
