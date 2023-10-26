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
import { EdgeView, Graph, Node, ToolsView } from "@antv/x6";
import ER from "./ER";
import mockDataJson from "./mockData.json";
import Table from "./components/table";
import "./components/erdRelation/index";
import { edgeNodeRemoveTool } from "./components/tools";
import { Dropdown, Menu } from "@arco-design/web-react";
import ReactDOM from "react-dom";
import { cloneDeep } from "@antv/x6/lib/util/object/object";

export interface ContextMenuToolOptions extends ToolsView.ToolItem.Options {
  menu: React.ReactElement;
}

let curEntity: Node = null;
const copyNum: { [key: string]: number } = {};

class ContextMenuTool extends ToolsView.ToolItem<
  EdgeView,
  ContextMenuToolOptions
> {
  private knob: HTMLDivElement;
  private timer: number;

  render() {
    if (!this.knob) {
      this.knob = ToolsView.createElement("div", false) as HTMLDivElement;
      this.knob.style.position = "absolute";
      this.container.appendChild(this.knob);
    }
    return this;
  }

  private toggleContextMenu(visible: boolean) {
    ReactDOM.unmountComponentAtNode(this.knob);
    document.removeEventListener("mousedown", this.onMouseDown);

    if (visible) {
      ReactDOM.render(
        <Dropdown
          popupVisible={true}
          trigger={["contextMenu"]}
          droplist={this.options.menu}
        >
          <a />
        </Dropdown>,
        this.knob
      );
      document.addEventListener("mousedown", this.onMouseDown);
    }
  }

  private updatePosition(e?: MouseEvent) {
    const style = this.knob.style;
    if (e) {
      const pos = this.graph.clientToGraph(e.clientX, e.clientY);
      style.left = `${pos.x}px`;
      style.top = `${pos.y}px`;
    } else {
      style.left = "-1000px";
      style.top = "-1000px";
    }
  }

  private onMouseDown = (e: any) => {
    console.log("e: ", e);
    this.timer = window.setTimeout(() => {
      this.updatePosition();

      const innerHTML = e.target.innerHTML;
      if (innerHTML.includes("删除")) {
        this.graph.removeNode(curEntity);
      } else if (innerHTML.includes("复制实体")) {
        console.log("curEntity: ", curEntity);
        if (!copyNum[curEntity.id]) {
          copyNum[curEntity.id] = 1;
        } else {
          copyNum[curEntity.id]++;
        }
        const cloneCurEntityData = cloneDeep(curEntity.getData());
        console.log("cloneCurEntityData: ", cloneCurEntityData);
        cloneCurEntityData.defKey = `${cloneCurEntityData.defKey}_${
          copyNum[curEntity.id]
        }`;
        cloneCurEntityData.defName = `${cloneCurEntityData.defName}_${
          copyNum[curEntity.id]
        }`;
        this.graph.copy([curEntity], {
          deep: true,
          offset: 30,
        } as any);
        const pasteEntity = this.graph.paste()[0];

        pasteEntity.setData(cloneCurEntityData);
        console.log("pasteEntity: ", pasteEntity);
      }
      this.toggleContextMenu(false);
      curEntity = null;
    }, 200);
  };

  private onContextMenu({ e }: { e: MouseEvent }) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
    this.updatePosition(e);
    this.toggleContextMenu(true);
  }

  delegateEvents() {
    this.cellView.on("cell:contextmenu", this.onContextMenu, this);
    return super.delegateEvents();
  }

  protected onRemove() {
    this.cellView.off("cell:contextmenu", this.onContextMenu, this);
  }
}
const menu = (
  <Menu>
    <Menu.Item key="复制实体">复制实体</Menu.Item>
    <Menu.Item key="删除">删除</Menu.Item>
  </Menu>
);

ContextMenuTool.config({
  tagName: "div",
  isSVGElement: false,
});

Graph.registerNodeTool("contextmenu", ContextMenuTool, true);

Graph.registerNode("table", {
  inherit: "react-shape",
  zIndex: 2,
  attrs: {
    body: {
      stroke: "#DFE3EB", // 边框颜色
      strokeWidth: 2,
      rx: 5,
      ry: 5,
    },
  },
  tools: [
    {
      name: "contextmenu",
      args: {
        menu,
        onclick({ view }: any) {
          const node = view.cell;
          console.log("node: ", node);
        },
      },
    },
  ],
  component: <Table />,
});

interface ErCanvasProps {
  setEntityDrawerVisible: (visible: boolean) => void;
  setCurrentEntity: (entities: any) => void;
  dataSource: any;
}

interface DataSource {
  relationType: string;
  [key: string]: any;
}

export interface ErCanvasInstance {
  getGraph: () => Graph;
  getDataSource: () => any;
  setDataSource: (data: any) => any;
  update: (dataSource: any) => any;
  addNewEntity: (formData: any) => any;
}

const ErCanvas = memo(
  forwardRef<ErCanvasInstance, ErCanvasProps>((props, ref) => {
    const { setEntityDrawerVisible, setCurrentEntity, dataSource } = props;
    const id = useMemo(() => `luban-er-${cuid()}`, []);
    const graphRef = useRef<Graph>(null);
    const erRef = useRef<ER>(null);
    const dataSourceRef = useRef<DataSource>();
    dataSourceRef.current = mockDataJson;
    const isScroll = useRef(false);
    const isInit = useRef(false);
    const scrollTimer = useRef(null);
    const isDoneInit = useRef(false);

    useImperativeHandle(ref, () => {
      return {
        getGraph: () => graphRef.current,
        getDataSource: () => dataSourceRef.current,
        setDataSource: (data: any) => {
          dataSourceRef.current = data;
          render();
        },
        update: (dataSource: any) => erRef.current.update(dataSource),
        addNewEntity: (formData: any) => erRef.current.addNewEntity(formData),
      };
    });

    const render = useMemoizedFn(() => {
      if (!isInit.current) {
        const json = erRef.current.render({
          data: mockDataJson as any,
          dataSource: dataSource as any,
        });
        console.log("ercanvas-render-json: ", json);
        graphRef.current.fromJSON(json);
        isInit.current = true;
      } else {
        console.log("render-dataSourceRef.current: ", dataSourceRef.current);
        erRef.current.update(dataSourceRef.current);
      }
    });

    const getDataSource = useMemoizedFn(() => {
      return dataSourceRef.current;
    });

    const updateDataSource = useMemoizedFn((dataSource) => {
      console.log("dataSource: ", dataSource);
      return 1;
    });

    /** 初始化 */
    const init = useMemoizedFn(() => {
      const container = document.getElementById(id);
      const graph = new Graph({
        container,
        resizing: false,
        grid: true,
        scroller: {
          enabled: true,
          pannable: true,
          autoResize: true,
          padding: 20,
        },
        clipboard: {
          enabled: true,
          useLocalStorage: true,
        },
        selecting: {
          enabled: true,
          multiple: true,
          rubberband: true,
          filter(node) {
            return !node.getProp("isLock");
          },
          modifiers: "alt|ctrl",
        },
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
        connecting: {
          connectionPoint: "boundary",
          snap: true,
          allowBlank: false,
          allowNode: false,
          highlight: true,
          createEdge() {
            return erRef.current.createEdge();
          },
          validateConnection({
            targetPort,
            targetView,
            sourcePort,
            sourceCell,
            targetCell,
          }) {
            if (targetCell.id === sourceCell.id) {
              return false;
            }
            return erRef.current.validateConnection({
              targetPort,
              targetView,
              sourceCell,
              sourcePort,
            });
          },
        },
      });
      graphRef.current = graph;
      const eR = new ER({
        graph,
        container,
        getDataSource,
        relationType: dataSourceRef.current.relationType,
        updateDataSource,
      });
      erRef.current = eR;
      graph.on("render:done", () => {
        graph.mousewheel.container.onscroll = () => {
          isScroll.current = true;
          if (scrollTimer.current) {
            clearTimeout(scrollTimer.current);
          }
          scrollTimer.current = setTimeout(() => {
            isScroll.current = false;
          }, 100);
          if (!isDoneInit.current) {
            graphRef.current.centerContent();
            isDoneInit.current = true;
          }
        };
      });
      graph.on("cell:click", ({ cell }) => {
        eR.cellClick({ cell, graph, id });
      });
      graph.on("node:dblclick", ({ cell, node }) => {
        console.log("cell: ", cell);
        console.log("node: ", node);
        if (cell.shape === "table") {
          const data = cell.getData();
          console.log("data: ", data);
          cell.data.fields.forEach((item: any) => {
            item.key = item.defKey;
            item.name = item.defKey;
            item.displayName = item.defName;
          });
          setCurrentEntity?.(cell);
          setEntityDrawerVisible?.(true);
        }
      });
      graph.on("node:mouseenter", ({ node }) => {
        eR.nodeMouseEnter({ node });
      });
      graph.on("node:mouseleave", ({ node }) => {
        eR.nodeMouseLeave({ node });
      });
      graph.on("edge:change:target", ({ edge, previous, current }) => {
        eR.edgeChangeTarget({ edge, previous, current });
      });
      graph.on("edge:mouseup", ({ edge }) => {
        eR.edgeMouseUp(edge);
      });
      graph.on("edge:mouseenter", ({ edge }) => {
        eR.edgeOver({
          edge,
          graph,
          id,
          isScroll: isScroll.current,
        });
      });
      graph.on("edge:mouseleave", ({ edge }) => {
        eR.edgeLeave(edge);
      });
      graph.on("edge:selected", ({ edge }) => {
        eR.edgeSelected(edge);
      });
      graph.on("edge:unselected", ({ edge }) => {
        edge.removeTools();
        edgeNodeRemoveTool(id);
      });
      graph.on("edge:connected", (args) => {
        eR.edgeConnected({ args, dataSource: dataSource });
      });
      graph.on("node:contextmenu", ({ node }) => {
        curEntity = node;
      });
    });
    useEffect(() => {
      init();
    }, [init]);

    useEffect(() => {
      render();
    }, [render]);

    return (
      <>
        <div className={styles.ErCanvas} id={id}></div>
        <div id={`${id}-cellTooltip`} />
      </>
    );
  })
);

export default ErCanvas;
