import { memo, useEffect, useMemo, useRef } from "react";
import styles from "./index.module.less";
import cuid from "cuid";
import { useMemoizedFn } from "ahooks";
import { Graph } from "@antv/x6";
import { adjustColorOpacity, getRandomColor } from "../../../../utils/tools";
import { Dnd } from "@antv/x6/lib/addon";

interface ErCanvasProps {
  width: number;
  height: number;
}

const ErCanvas = memo((props: ErCanvasProps) => {
  const { width, height } = props;
  const id = useMemo(() => `er-${cuid()}`, []);
  const graphRef = useRef<Graph>();

  /** 自适应大小 */
  const resize = useMemoizedFn(() => {
    graphRef.current?.resize(width, height);
  });

  /** 绑定快捷键 */
  const bindKeys = useMemoizedFn(() => {
    graphRef.current?.bindKey(["ctrl+c", "command+c"], (e) => {
      const cells = graphRef.current?.getSelectedCells();
      if (
        (e.target as HTMLInputElement).tagName !== "TEXTAREA" &&
        cells &&
        cells.length
      ) {
        graphRef.current?.copy(cells, { deep: true });
      } else {
        graphRef.current?.cleanClipboard();
      }
    });
  });

  /** 加载数据 */
  const loadData = useMemoizedFn(() => {
    const data = {
      // 节点
      nodes: [
        {
          id: "node1", // String，可选，节点的唯一标识
          x: 40, // Number，必选，节点位置的 x 值
          y: 40, // Number，必选，节点位置的 y 值
          width: 80, // Number，可选，节点大小的 width 值
          height: 40, // Number，可选，节点大小的 height 值
          label: "hello", // String，节点标签
        },
        {
          id: "node2", // String，节点的唯一标识
          x: 160, // Number，必选，节点位置的 x 值
          y: 180, // Number，必选，节点位置的 y 值
          width: 80, // Number，可选，节点大小的 width 值
          height: 40, // Number，可选，节点大小的 height 值
          label: "world", // String，节点标签
        },
      ],
      // 边
      edges: [
        {
          source: "node1", // String，必须，起始节点 id
          target: "node2", // String，必须，目标节点 id
        },
      ],
    };

    graphRef.current?.fromJSON(data);
  });

  /** 初始化 */
  const init = useMemoizedFn(() => {
    const graph = new Graph({
      async: true,
      height,
      width,
      container: document.getElementById(id) as HTMLElement,
      autoResize: false,
      background: {
        color: adjustColorOpacity(getRandomColor(), 0.1), // 设置画布背景颜色
      },
    });
    graphRef.current = graph;

    bindKeys();
    loadData();
  });

  useEffect(() => {
    resize();
  }, [width, height, resize]);

  useEffect(() => {
    init();
  }, [init]);

  return <div className={styles.ErCanvas} id={id}></div>;
});

export default ErCanvas;
