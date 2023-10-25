import { Cell, CellView, Edge, Graph, Node, Shape } from "@antv/x6";
import { DataSource, Field, calcCellData } from "./_util/dataSource_util";
import { edgeNodeAddTool } from "./components/tools";

interface ERConstructorProps {
  graph: Graph;
  container: HTMLElement;
  getDataSource: any;
  relationType: any;
  updateDataSource: any;
}

interface FilterErCellProps {
  cells: Cell[] | Cell;
}

interface NodeDbClickProps {
  e: Event;
  cell: Cell;
  dataSource: DataSource;
}

interface NodeMouseEnterProps {
  node: Node;
  graph?: Graph;
  id?: string;
  isScroll?: boolean;
}

interface RenderProps {
  data: {
    canvasData: {
      cells: Cell[];
      [key: string]: any;
    };
    [key: string]: any;
  };
  dataSource: DataSource;
}

interface UpdateFieldsProps {
  originKey: string;
  fields: Field[];
}

interface ChangePortsVisibleProps {
  visible: boolean;
  node?: Node | Cell;
  source?: any;
}

interface EdgeChangeTargetProps {
  edge: Edge;
  previous: any;
  current: any;
}

interface ValidateConnectionProps {
  targetPort: string | null;
  targetView: CellView;
  sourcePort: string | null;
  sourceCell: Cell | null;
}

interface EdgeOverProps {
  edge: Edge;
  graph: Graph;
  id: string;
  isScroll: boolean;
}

interface CellClickProps {
  cell: Cell | Node;
  graph: Graph;
  id: string;
}

export const DEFAULT_EDIT_NODE_SIZE = {
  width: 80,
  height: 60,
  minHeight: 20,
};

export default class ER {
  graph: Graph;
  getDataSource: any;
  relationType: any;
  updateDataSource: any;
  container: HTMLElement;
  currentColor = {
    selected: "#1890FF", // 选中色
    border: "#DFE3EB", // 边框色
    fillColor: "#ACDAFC", // 节点和边的背景色
    fontColor: "#000000", // 节点字体色
    circleFill: "#FFF", // 锚点填充色
    fill: "#DDE5FF",
  };
  commonPort = {
    attrs: {
      fo: {
        width: 8,
        height: 8,
        x: -4,
        y: -4,
        magnet: "true",
        style: {
          visibility: "hidden",
        },
      },
    },
    zIndex: 3,
  };
  commonPorts = {
    groups: {
      in: {
        ...this.commonPort,
        position: { name: "left" },
      },
      out: {
        ...this.commonPort,
        position: { name: "right" },
      },
      top: {
        ...this.commonPort,
        position: { name: "top" },
      },
      bottom: {
        ...this.commonPort,
        position: { name: "bottom" },
      },
    },
    items: [
      { group: "in", id: "in" },
      { group: "in", id: "in2" },
      { group: "in", id: "in3" },
      { group: "out", id: "out" },
      { group: "out", id: "out2" },
      { group: "out", id: "out3" },
      { group: "top", id: "top" },
      { group: "top", id: "top2" },
      { group: "top", id: "top3" },
      { group: "bottom", id: "bottom" },
      { group: "bottom", id: "bottom2" },
      { group: "bottom", id: "bottom3" },
    ],
  };
  commonEntityPorts = {
    groups: {
      in: {
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: this.currentColor.selected,
            fill: this.currentColor.circleFill,
            strokeWidth: 1,
            style: {
              visibility: "hidden",
            },
          },
        },
        zIndex: 3,
        position: { name: "left" },
      },
      out: {
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: this.currentColor.selected,
            fill: this.currentColor.circleFill,
            strokeWidth: 1,
            style: {
              visibility: "hidden",
            },
          },
        },
        position: { name: "right" },
      },
      top: {
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: this.currentColor.selected,
            fill: this.currentColor.circleFill,
            strokeWidth: 1,
            style: {
              visibility: "hidden",
            },
          },
        },
        position: { name: "top" },
      },
      bottom: {
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: this.currentColor.selected,
            fill: this.currentColor.circleFill,
            strokeWidth: 1,
            style: {
              visibility: "hidden",
            },
          },
        },
        position: { name: "bottom" },
      },
    },
    items: [
      { group: "in", id: "in" },
      { group: "in", id: "in2" },
      { group: "in", id: "in3" },
      { group: "out", id: "out" },
      { group: "out", id: "out2" },
      { group: "out", id: "out3" },
      { group: "top", id: "top" },
      { group: "top", id: "top2" },
      { group: "top", id: "top3" },
      { group: "bottom", id: "bottom" },
      { group: "bottom", id: "bottom2" },
      { group: "bottom", id: "bottom3" },
    ],
  };
  defaultEditNodeSize = {
    ...DEFAULT_EDIT_NODE_SIZE,
  };
  constructor({
    graph,
    getDataSource,
    relationType,
    container,
    updateDataSource,
  }: ERConstructorProps) {
    this.graph = graph;
    this.getDataSource = getDataSource;
    this.relationType = relationType;
    this.container = container;
    this.updateDataSource = updateDataSource;
  }
  filterErCell = ({ cells }: FilterErCellProps) => {
    const erCells = ["table", "erdRelation", "group"];
    return [].concat(cells).filter((c) => {
      return erCells.includes(c.shape);
    });
  };
  isErCell = (cell: Cell) => {
    return this.filterErCell({ cells: cell }).length > 0;
  };
  getTableGroup = () => {
    return {
      in: {
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: this.currentColor.selected,
            fill: this.currentColor.circleFill,
            strokeWidth: 1,
            style: {
              visibility: "hidden",
            },
          },
        },
        position: { name: "absolute" },
        zIndex: 3,
      },
      out: {
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: this.currentColor.selected,
            fill: this.currentColor.circleFill,
            strokeWidth: 1,
            style: {
              visibility: "hidden",
            },
          },
        },
        position: { name: "absolute" },
        zIndex: 3,
      },
      extend: {
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: this.currentColor.selected,
            fill: this.currentColor.circleFill,
            strokeWidth: 1,
            style: {
              visibility: "hidden",
            },
          },
        },
        position: { name: "absolute" },
        zIndex: 3,
      },
    };
  };
  updateFields = ({ originKey, fields }: UpdateFieldsProps) => {
    // const getKey = (f: Field) => {
    //   return `${f.defKey}${f.defName}`;
    // };
    // const result = {};
  };
  nodeDbClick = ({ e, cell, dataSource }: NodeDbClickProps) => {
    if (this.isErCell(cell)) {
      if (cell.shape === "table") {
        const cellData = cell.getData();
        console.log("cellData: ", cellData);
        const key = cell.getProp("originKey");
        const group =
          dataSource?.viewGroups?.find((v: any) =>
            v.refEntities?.some((r: any) => r === key)
          )?.id || "";
        const entityTabKey = `${key}%entity`;
      }
    }
  };
  nodeMouseEnter = ({ node, graph, id, isScroll }: NodeMouseEnterProps) => {
    if (this.isErCell(node)) {
      if (!this.graph.isSelected(node) || node.shape === "table") {
        this.changePortsVisible({ node, visible: true });
      }
    }
  };
  nodeMouseLeave = ({ node }: NodeMouseEnterProps) => {
    if (this.isErCell(node)) {
      this.changePortsVisible({ visible: false, node });
    }
  };
  createEdge = () => {
    return new Shape.Edge({
      shape: "erdRelation",
      isTemp: true, // 临时创建文件 无需在历史中存在
      attrs: {
        line: {
          strokeWidth: 1,
          stroke: this.currentColor.fillColor,
          sourceMarker: {
            relation: "1",
            name: "relation",
            fillColor: this.currentColor.fillColor,
          },
          targetMarker: {
            relation: "1",
            name: "relation",
            fillColor: this.currentColor.fillColor,
          },
        },
      },
      router: {
        name: "manhattan",
      },
      connector: "rounded",
    });
  };

  nodeTextClick = ({ node }: { node: Node }) => {
    console.log("node: ", node);
  };

  render = ({ data, dataSource }: RenderProps) => {
    console.log("er-render-data: ", data);
    return calcCellData({
      cells: data.canvasData.cells,
      dataSource,
      updateFields: this.updateFields,
      commonEntityPorts: this.commonEntityPorts,
      commonPorts: this.commonPorts,
      relationType: this.relationType,
      nodeClickText: this.nodeDbClick,
      groups: this.getTableGroup(),
    });
  };
  changePortsVisible = ({ visible, node, source }: ChangePortsVisibleProps) => {
    const currentNodeDom = node
      ? Array.from(this.container.querySelectorAll(".x6-node")).find((n) => {
          return n.getAttribute("data-cell-id") === node.id;
        })
      : this.container;
    const ports: HTMLElement[] =
      Array.from(currentNodeDom.querySelectorAll(".x6-port-body")) || [];
    for (let i = 0, len = ports.length; i < len; i++) {
      const portName = ports[i].getAttribute("port");
      if (source && source.includes("extend")) {
        if (portName.includes("extend")) {
          ports[i].style.visibility = visible ? "visible" : "hidden";
        } else {
          ports[i].style.visibility = "hidden";
        }
      } else if (source && portName.includes("extend")) {
        ports[i].style.visibility = "hidden";
      } else {
        ports[i].style.visibility = visible ? "visible" : "hidden";
      }
    }
    if (visible && (!node || node.shape !== "group")) {
      setTimeout(() => {
        node.toFront();
      });
    }
  };
  edgeChangeTarget = ({ edge, ...otherOptions }: EdgeChangeTargetProps) => {
    if (this.isErCell(edge)) {
      const previous = this.graph.getCell(otherOptions.previous.cell);
      const current = this.graph.getCell(otherOptions.current.cell);
      previous?.setProp("targetPort", "", { ignoreHistory: true });
      current?.setProp("targetPort", otherOptions.current?.port, {
        ignoreHistory: true,
      });
    }
  };
  validateConnection = ({
    targetPort,
    targetView,
    sourceCell,
    sourcePort,
  }: ValidateConnectionProps) => {
    if (targetView) {
      const node = targetView.cell;
      this.changePortsVisible({ visible: true, node, source: sourcePort });
      if (sourcePort) {
        // 阻止自联
        if (sourcePort === targetPort && sourceCell === node) {
          return false;
        }
      }
      if (sourcePort && sourcePort.includes("extend")) {
        return targetPort.includes("extend");
      }
      return !targetPort.includes("extend");
    }
    return true;
  };
  edgeMouseUp = (edge: Edge) => {
    if (this.isErCell(edge)) {
      const target = edge.getTargetCell();
      const source = edge.getSourceCell();
      target.setProp("targetPort", "", { ignoreHistory: true });
      source.setProp("targetPort", "", { ignoreHistory: true });
      this.changePortsVisible({ visible: false });
    }
  };
  edgeOver = ({ edge, graph, id, isScroll }: EdgeOverProps) => {
    if (this.isErCell(edge)) {
      const sourceNode = edge.getSourceCell();
      const targetNode = edge.getTargetCell();
      sourceNode?.setProp("sourcePort", edge.getSourcePortId(), {
        ignoreHistory: true,
      });
      targetNode?.setProp("targetPort", edge.getTargetPortId(), {
        ignoreHistory: true,
      });
      edge.attr("line/stroke", this.currentColor.selected, {
        ignoreHistory: true,
      });
      const edgeAttrs = edge.getAttrs();
      console.log("edgeAttrs: ", edgeAttrs);
      edge.attr("line/sourceMarker/fillColor", this.currentColor.selected, {
        ignoreHistory: true,
      });
      edge.attr("line/targetMarker/fillColor", this.currentColor.selected, {
        ignoreHistory: true,
      });
    }
  };
  edgeLeave = (edge: Edge) => {
    if (this.isErCell(edge)) {
      console.log("edgeLeave-edge: ", edge);
      const sourceNode = edge.getSourceCell();
      const targetNode = edge.getTargetCell();
      sourceNode?.setProp("sourcePort", "", { ignoreHistory: true });
      targetNode?.setProp("targetPort", "", { ignoreHistory: true });
      edge.attr(
        "line/stroke",
        edge.getProp("fillColor") || this.currentColor.fillColor,
        { ignoreHistory: true }
      );
      edge.attr(
        "line/sourceMarker/fillColor",
        edge.getProp("fillColor") || this.currentColor.fillColor,
        { ignoreHistory: true }
      );
      edge.attr(
        "line/targetMarker/fillColor",
        edge.getProp("fillColor") || this.currentColor.fillColor,
        { ignoreHistory: true }
      );
    }
  };
  edgeSelected = (edge: Edge) => {
    if (this.isErCell(edge)) {
      edge.addTools([
        {
          name: "vertices",
          args: {
            attrs: {
              stroke: this.currentColor.selected,
              fill: this.currentColor.circleFill,
              strokeWidth: 2,
            },
          },
        },
        {
          name: "target-arrowhead",
          args: {
            attrs: {
              d: "M 0, -5 a 5,5,0,1,1,0,10 a 5,5,0,1,1,0,-10",
              fill: this.currentColor.selected,
            },
          },
        },
        {
          name: "source-arrowhead",
          args: {
            attrs: {
              d: "M 0, -5 a 5,5,0,1,1,0,10 a 5,5,0,1,1,0,-10",
              fill: this.currentColor.selected,
            },
          },
        },
      ]);
    }
  };
  cellClick = ({ cell, graph, id }: CellClickProps) => {
    if (this.isErCell(cell)) {
      if (!cell.isEdge()) return;
      edgeNodeAddTool({
        edge: cell,
        graph,
        id,
        relationType: this.relationType,
        getDataSource: this.getDataSource,
        updateDataSource: this.updateDataSource,
      });
    }
  };
}
