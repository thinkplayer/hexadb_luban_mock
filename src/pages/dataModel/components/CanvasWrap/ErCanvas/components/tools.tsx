import { Cell, Edge, Graph } from "@antv/x6";
import ReactDOM from "react-dom";
import EdgeTooltipContent from "./EdgeTooltipContent";

interface EdgeNodeAddToolProps {
  edge: Edge;
  graph: Graph;
  id: string;
  dataChange: any;
  getDataSource: any;
  updateDataSource: any;
  relationType: string;
  updateLayout: any;
}

export interface OnUpdateProps {
  value?: any;
  type:
    | "lineType"
    | "lineStyle"
    | "relation"
    | "arrow-exchange"
    | "autoSize"
    | "fillColor"
    | string;
  reverse?: boolean;
}

let preNode: any;
export const edgeNodeRemoveTool = (id: string) => {
  const cellTooltip = document.getElementById(`${id}-cellTooltip`);
  if (cellTooltip) {
    Array.from(cellTooltip.children).forEach((c) => {
      cellTooltip.removeChild(c);
    });
    preNode = null;
  }
};

export const edgeNodeAddTool = ({
  edge,
  graph,
  id,
  getDataSource,
  updateDataSource,
  dataChange,
}: EdgeNodeAddToolProps) => {
  if (preNode !== edge) {
    preNode = edge;
    const cellTooltip = document.getElementById(`${id}-cellTooltip`);
    console.log("cellTooltip: ", cellTooltip);
    const { container } = graph.findView(edge) || {};
    if (cellTooltip && container) {
      cellTooltip.innerHTML = "";
      const canvasContainer = cellTooltip.parentElement;
      const canvasContainerRect = canvasContainer.getBoundingClientRect();
      const rect = container.getBoundingClientRect();
      const height = 34;
      let left: number, width: number;
      const toolParent = document.createElement("div");
      toolParent.setAttribute("class", `luban-cell-tooltip`);
      toolParent.style.position = "absolute";
      const calcLeft = () => {
        width = edge.isNode() ? 170 : 250;
        if (edge.shape === "table") {
          width = 110;
        }
        left = rect.x - canvasContainerRect.x + rect.width / 2 - width / 2;
        toolParent.style.left = `${left}px`;
      };
      calcLeft();
      toolParent.style.bottom = `${
        canvasContainerRect.bottom - rect.top + 10
      }px`;
      toolParent.style.height = `${height}px`;

      const onUpdate = ({ value: v, type: t, reverse }: OnUpdateProps) => {
        console.log("onUpdate-v: ", { v, t, reverse });
        graph.batchUpdate("updateEdgeOrNode", () => {
          if (t === "lineType") {
            if (v === "straight") {
              edge.setProp("router", {
                name: "normal",
              });
              edge.setProp("vertices", []);
              edge.setProp("connector", {
                name: "normal",
              });
            } else {
              if (v === "fillet") {
                edge.setProp("connector", {
                  name: "rounded",
                  args: {
                    radius: 10,
                  },
                });
              } else {
                edge.setProp("connector", {
                  name: "normal",
                });
              }
              edge.setProp("router", {
                name: "manhattan",
                args: {
                  excludeShapes: ["group"],
                },
              });
            }
          } else if (t === "lineStyle") {
            if (v === "dotted-large") {
              edge.attr("line/strokeDasharray", "5 5");
            } else {
              edge.attr("line/strokeDasharray", "");
            }
          } else if (t === "relation") {
            if (reverse) {
              edge.attr("line/sourceMarker/relation", v);
            } else {
              edge.attr("line/targetMarker/relation", v);
            }
            edge.setProp(
              "relation",
              `${edge.attr("line/sourceMarker/relation")}:${edge.attr(
                "line/targetMarker/relation"
              )}`
            );
          } else if (t === "arrow-exchange") {
            edge.attr("line", {
              sourceMarker: {
                relation: edge.attr("line/targetMarker/relation"),
              },
              targetMarker: {
                relation: edge.attr("line/sourceMarker/relation"),
              },
            });
            edge.setProp(
              "relation",
              `${edge.attr("line/sourceMarker/relation")}:${edge.attr(
                "line/targetMarker/relation"
              )}`
            );
          } else if (t === "fillColor") {
            let cells = graph.getSelectedCells();
            if (cells.length === 0) {
              cells = graph.getCells();
            }
            cells.forEach((c) => {
              c.setProp(t, v.hex);
              if (c.shape === "erdRelation") {
                if (t === "fillColor") {
                  const tempLine: Cell["attrs"] = c.attr("line");
                  c.attr("line", {
                    ...tempLine,
                    stroke: v.hex,
                    sourceMarker: {
                      ...tempLine.sourceMarker,
                      fillColor: v.hex,
                    },
                    targetMarker: {
                      ...tempLine.targetMarker,
                      fillColor: v.hex,
                    },
                  });
                }
                if (reverse) {
                  const dataSource = getDataSource();
                  const recentColors = [
                    ...new Set(
                      (dataSource.profile.recentColors || []).concat(v.hex)
                    ),
                  ];
                  const start =
                    recentColors.length - 8 > 0 ? recentColors.length - 8 : 0;
                  const tempDataSource = {
                    ...dataSource,
                    profile: {
                      ...dataSource.profile,
                      recentColors: recentColors.slice(
                        start,
                        recentColors.length
                      ),
                    },
                  };
                  updateDataSource && updateDataSource(tempDataSource);
                }
              }
            });
          }
          t !== "label" && t !== "link" && dataChange && dataChange();
        });
      };
      const movePositon = {
        left: canvasContainerRect.left,
        top: canvasContainerRect.top,
      };
      const position = {
        left: left + width / 2 + rect.width / 2,
        top: rect.top - canvasContainerRect.top,
      };
      console.log("position: ", position);
      ReactDOM.render(
        <EdgeTooltipContent
          id={id}
          edge={edge as Edge}
          position={position}
          movePosition={movePositon}
          onUpdate={onUpdate}
          getDataSource={getDataSource}
        />,
        toolParent
      );
      console.log("toolParent: ", toolParent);
      cellTooltip.appendChild(toolParent);
    }
  }
};
