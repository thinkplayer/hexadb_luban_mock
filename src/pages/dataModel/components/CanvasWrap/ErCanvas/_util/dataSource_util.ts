import { Cell } from "@antv/x6";
import { PortManager } from "@antv/x6/lib/model/port";
import { Edge, Node, Node as NodeManager } from "@antv/x6/lib/model";
import cuid from "cuid";

export type Header = {
  refKey: string;
  [key: string]: any;
};

export type Field = {
  id: string;
  defKey: string;
  defName: string;
  primaryKey: string;
  [key: string]: any;
};

export type MaxWidth = {
  [key: string]: any;
};

export type DataSource = {
  entities: {
    fields: Field[];
    [key: string]: any;
  };
  profile: {
    headers: Header[];
    [key: string]: any;
  };
  [key: string]: any;
};
export type NodeData = {
  fields: Field[];
  headers: Header[];
  defName: string;
  [key: string]: any;
};
export interface CalcCellDataProps extends Omit<MapData2TableProps, "n"> {
  cells: Cell[];
}
export interface MapData2TableProps {
  n: Cell & { [key: string]: any };
  dataSource: DataSource;
  updateFields: any;
  groups: PortManager.Metadata["groups"];
  commonPorts: any;
  relationType: string;
  commonEntityPorts: any;
  nodeClickText: any;
}
export interface CalcNodeDataProps {
  nodeData: NodeData | any;
  dataSource: DataSource;
  groups: PortManager.Metadata["groups"];
  n: {
    autoSize: boolean;
    size: NodeManager.Metadata["size"];
    needTransForm: boolean;
    data: {
      fields: any[];
      originWidth?: {
        [key: string]: any;
      };
      [key: string]: any;
    };
  };
}

interface GetTextWidthProps {
  text: string;
  fontSize?: number;
  fontWeight?: string;
}

interface FilterEdgeProps {
  allNodes: Node[];
  e: Edge.Metadata;
}

export const filterEdge = ({ allNodes, e }: FilterEdgeProps) => {
  return (
    allNodes.filter((n) => {
      if (n.id === e.sourceCell) {
        n.ports.items.findIndex((i) => i.id === e.sourcePort) >= 0;
      } else if (n.id === e.targetCell) {
        return n.ports.items.findIndex((i) => i.id === e.targetPort) >= 0;
      }
      return false;
    }).length === 2
  );
};

export const calcCellData = ({
  cells,
  dataSource,
  updateFields,
  groups,
  commonEntityPorts,
  commonPorts,
  relationType,
  nodeClickText,
}: CalcCellDataProps) => {
  console.log("calcCellData-cells: ", cells);
  const nodes = cells
    .filter((c) => c.shape === "table")
    .map((cell) => {
      return mapData2Table({
        n: cell,
        dataSource,
        updateFields,
        groups,
        commonEntityPorts,
        commonPorts,
        relationType,
        nodeClickText,
      });
    });
  const allNodes = nodes || [];
  console.log("allNodes: ", allNodes);
  const edges = cells
    .filter((c) => c.shape === "erdRelation")
    .filter((e) => {
      return filterEdge({ allNodes, e });
    });
  console.log("calcCellData-edges: ", edges);
  return [].concat(allNodes).concat(edges);
};

export const mapData2Table = ({
  n,
  dataSource,
  updateFields,
  groups,
  relationType,
  commonEntityPorts,
  nodeClickText,
}: MapData2TableProps) => {
  console.log("mapData2Table-props: ", { n, dataSource, groups, relationType });
  const nodeData = dataSource?.entities?.find((e: any) => e.id === n.originKey);
  console.log("mapData2Table-nodeData: ", nodeData);
  if (nodeData) {
    const { width, height, ports, fields, headers, maxWidth, originWidth } =
      calcNodeData({
        n: n as any,
        nodeData,
        dataSource,
        groups,
      });

    return {
      ...n,
      size: {
        width,
        height,
      },
      ports: relationType === "entity" ? n.port || commonEntityPorts : ports,
      updateFields,
      nodeClickText,
      data: {
        ...nodeData,
        fields,
        headers,
        maxWidth,
        originWidth,
      },
    };
  }

  return nodeData;
};

export const calcNodeData = ({
  n,
  nodeData,
  groups,
  dataSource,
}: CalcNodeDataProps) => {
  const size = n.size;
  const preData = n.data;
  const headers = (nodeData.headers || []).filter((h: any) => {
    const columnOthers: any =
      (dataSource?.profile?.headers || []).find((c) => c.refKey === h.refKey) ||
      {};
    return !h.hideInGraph && columnOthers.enabled !== false;
  });
  // console.log(
  // "🚀 ~ file: dataSource_util.ts:188 ~ headers ~ headers:",
  // headers
  // );
  console.log("headers: ", headers);
  const fields = nodeData.fields || [];
  const headerText = nodeData.defName + nodeData.defKey + "未物化";
  const headerWidth =
    getTextWidth({
      text: headerText,
      fontSize: 12,
      fontWeight: "bold",
    }) + 60;
  // console.log("🚀 ~ file: dataSource_util.ts:196 ~ headerWidth:", headerWidth);
  // 计算每一列最长的内容
  const maxWidth: { [key: string]: any } = {};
  const defaultWidth: any = {
    primaryKey: 40, // 主键和外键的默认宽度
    notNull: 70, // 非空默认宽度
  };
  const preFields = preData?.fields || [];
  fields.forEach((f: any) => {
    const preF = preFields.find((p) => p.id === f.id);
    Object.keys(f).forEach((fName) => {
      if (!maxWidth[fName]) {
        maxWidth[fName] = 0;
      }
      const getFieldWidth = () => {
        const fieldValue = (f[fName] || "").toString();
        if (preF) {
          const preFieldValue = (preF[fName] || "").toString();
          if (preFieldValue === fieldValue && preData.originWidth) {
            return preData.originWidth[fName] || 0;
          }
          return getTextWidth({ text: fieldValue });
        }
        return getTextWidth({ text: fieldValue });
      };
      const fieldWidth = defaultWidth[fName] || getFieldWidth();
      if (maxWidth[fName] < fieldWidth) {
        maxWidth[fName] = fieldWidth;
      }
    });
  });
  // 计算矩形的宽高
  let width =
    headers.reduce((a: any, b: any) => {
      return a + (maxWidth[b.refKey] || 10) + 8;
    }, 0) + 16; // 内容宽度加上左侧边距
  if (width < headerWidth) {
    width = headerWidth;
  }
  // 高度除了字段还包含表名，所以需要字段 +1
  const height = (fields.length + 1) * 36 - 8;
  // 去除重复的字段
  const filterFields = (data: Field[]) => {
    const repeat = [...data];
    return data.filter((d) => {
      return repeat.filter((r) => r.defKey === d.defKey).length === 1;
    });
  };
  const realWidth = width;
  const realHeight = height;
  let sliceCount = -1;
  if (size) {
    sliceCount = Math.floor((size.height - 31) / 36) * 2;
  }
  const filterFieldsRes = filterFields(fields);
  console.log("filterFieldsRes: ", filterFieldsRes);
  const ports = groups
    ? {
        groups,
        items: filterFields(fields).reduce((a, b, i) => {
          return a
            .concat(
              [
                {
                  group: "in",
                  args: { x: 0, y: 48 + i * 36 },
                  id: `${b.defKey}%in`,
                },
                {
                  group: "out",
                  args: { x: 0 + realWidth, y: 48 + i * 36 },
                  id: `${b.defKey}%out`,
                },
              ],
              []
            )
            .map((item: any, i: number) => {
              if (size && sliceCount !== -1 && i >= sliceCount) {
                return {
                  ...item,
                  attrs: {
                    circle: {
                      magnet: true,
                      style: {
                        // 隐藏锚点
                        // opacity: 0,
                      },
                    },
                  },
                };
              }
              return item;
            });
        }, []),
      }
    : {};
  const getRealMaxWidth = (w: MaxWidth) => {
    if (size) {
      const allKeys = Object.keys(w).filter((n) => {
        headers.some((h: any) => h.refKey === n);
      });
      const finalWidth = realWidth - 16 - allKeys.length * 8;
      const keysWidth = allKeys.reduce((p, n) => p + w[n], 0);
      return allKeys.reduce(
        (p, n) => {
          return {
            ...p,
            [n]: Math.ceil((w[n] / keysWidth) * finalWidth),
          };
        },
        { ...w }
      );
    }
    return w;
  };
  return {
    width: realWidth,
    height: realHeight,
    maxWidth: getRealMaxWidth(maxWidth),
    originWidth: maxWidth,
    fields,
    headers,
    ports,
  };
};

// 缓存文本宽度 减少dom计算渲染
let textWidthCache: { [key: string]: any } = {};
export const getTextWidth = ({
  text,
  fontSize = 12,
  fontWeight = "normal",
}: GetTextWidthProps) => {
  if (text in textWidthCache) {
    return textWidthCache[text];
  }
  let dom = document.getElementById("calcTextWidth");
  if (!dom) {
    dom = document.createElement("div");
    dom.setAttribute("id", "calcTextWidth");
    dom.style.display = "inline-block";
    dom.style.fontWeight = fontWeight;
    dom.style.fontSize = `${fontSize}px`;
    document.body.appendChild(dom);
  }
  dom.innerText =
    typeof text === "string" ? text.replace(/\r|\n|\r\n/g, "") : text;
  const width = dom.getBoundingClientRect().width;
  if (Object.keys(textWidthCache).length > 1000000) {
    // 如果缓存数量超过百万 则清除数据 释放内存
    textWidthCache = {};
  }
  textWidthCache[text] = width;
  return Math.ceil(width);
};

export const getTitle = (data: any) => {
  const tempDisplayMode = data.nameTemplate || "{defKey}({defName})";
  return tempDisplayMode.replace(/\{(\w+)\}/g, (_match: any, word: any) => {
    return data[word] || data.defKey || "";
  });
};

export const getPresetColors = () => {
  return [
    "rgb(25, 25, 26)",
    "rgb(255, 255, 255)",
    "rgb(183, 185, 189)",
    "rgb(247, 151, 128)",
    "rgb(245, 220, 78)",
    "rgb(116, 212, 151)",
    "rgb(117, 190, 250)",
    "rgb(255, 137, 175)",
    "rgb(249, 186, 80)",
    "rgb(90, 213, 198)",
    "rgb(218, 137, 241)",
    "rgb(113, 114, 115)",
    "rgb(214, 74, 67)",
    "rgb(207, 172, 19)",
    "rgb(51, 153, 108)",
    "rgb(52, 124, 212)",
    "rgb(208, 67, 138)",
    "rgb(211, 122, 17)",
    "rgb(35, 156, 163)",
    "rgb(154, 72, 199)",
  ];
};

export const getEmptyEntity = (fields: any[] = []) => {
  return {
    id: cuid(),
    defKey: "",
    defName: "",
    nameTemplate: "{defKey}({defName})",
    headers: getFullColumns().map((h) => ({
      freeze: !!(h.newCode === "defKey" || h.newCode === "defName"),
      refKey: h.newCode,
      hideInGraph: h.relationNoShow,
    })),
    fields,
    correlations: [] as any[],
    indexes: [] as any[],
  };
};

export const getFullColumns = () => {
  return [
    {
      code: "name",
      value: "字段代码",
      newCode: "defKey",
      com: "Input",
      relationNoShow: false,
    },
    {
      code: "chnname",
      value: "显示名称",
      newCode: "defName",
      com: "Input",
      relationNoShow: false,
    },
  ]; // 完整的头部信息
};
