import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import styles from "./index.module.less";
import cuid from "cuid";
import { useMemoizedFn } from "ahooks";
import { Graph } from "@antv/x6";
import { registerShape } from "./registerShape";
registerShape();
interface ErCanvasProps {
  width?: number;
  height?: number;
}

export interface ErCanvasInstance {
  getGraph: () => Graph;
}

const ErCanvas = memo(
  forwardRef<ErCanvasInstance, ErCanvasProps>((props, ref) => {
    const id = useMemo(() => `luban-er-${cuid()}`, []);
    const graphRef = useRef<Graph>();

    useImperativeHandle(ref, () => {
      return {
        getGraph: () => graphRef.current,
      };
    });

    /** 初始化 */
    const init = useMemoizedFn(() => {
      const graph = new Graph({
        container: document.getElementById(id),
        resizing: false,
        grid: true,
        scroller: {
          enabled: true,
          pannable: true,
          autoResize: true,
          padding: 20,
        },
        mousewheel: {
          enabled: true,
          modifiers: ["ctrl", "meta"],
          minScale: 0.3,
          maxScale: 3,
        },
      });
      graphRef.current = graph;
      graph.on("node:mouseenter", ({ node }) => {
        const { data } = node;
        const { fields = [] } = data;
        fields.forEach(() => {
          node.addPort({
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#31d0c6",
                fill: "#fff",
                strokeWidth: 2,
              },
            },
          });
        });
      });
      graph.on("node:mouseleave", ({ node }) => {
        const ports = node.getPorts();
        node.removePorts(ports);
      });
    });

    useEffect(() => {
      init();
    }, [init]);

    return <div className={styles.ErCanvas} id={id}></div>;
  })
);

export default ErCanvas;
