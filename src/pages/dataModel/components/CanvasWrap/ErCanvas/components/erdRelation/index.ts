import { Graph } from "@antv/x6";

Graph.registerEdge("erdRelation", {
  inherit: "edge",
  router: {
    name: "manhattan",
    args: {
      excludeShapes: ["group"],
    },
  },
  zIndex: 3,
  propHooks(metadata) {
    const { relation, fillColor, ...others } = metadata;
    if (relation) {
      return {
        ...metadata,
        attrs: {
          line: {
            stroke: fillColor,
            strokeDasharray: metadata?.attrs?.line?.strokeDasharray,
            sourceMarker: {
              fillColor,
              relation: relation.split(":")[0],
            },
            targetMarker: {
              fillColor,
              relation: relation.split(":")[1],
            },
          },
        },
      };
    }
    return others;
  },
  attrs: {
    line: {
      strokeWidth: 1,
      stroke: "#ACDAFC",
      sourceMarker: {
        name: "relation",
      },
      targetMarker: {
        name: "relation",
      },
    },
  },
});
