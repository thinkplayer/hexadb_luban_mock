import { Graph } from "@antv/x6";
import "@antv/x6-react-shape";
import ShapeTable from "./ShapeTable";

export const registerShape = () => {
  Graph.registerNode("group", {
    inherit: "react-shape",
    zIndex: 1,
    attrs: {
      body: {
        strokeDasharray: "5 5",
        strokeWidth: 2,
        stroke: "#000000",
      },
    },
  });

  Graph.registerNode("table", {
    inherit: "react-shape",
    zIndex: 12,
    attrs: {
      body: {
        stroke: "#DFE3EB", // 边框颜色
        strokeWidth: 2,
        rx: 4,
        ry: 4,
      },
    },
    component: <ShapeTable />,
  });
};
