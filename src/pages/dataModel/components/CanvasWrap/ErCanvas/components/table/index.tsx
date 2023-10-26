import { forwardRef, useMemo } from "react";
import "@antv/x6-react-shape";
import { Node } from "@antv/x6";
import ER from "../../ER";
import { Field, Header, getTitle } from "../../_util/dataSource_util";
import { Tooltip } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";

interface TableInstance {}

interface TableProps {
  node?: Node;
}

interface ValidateSelectedProps {
  field: Field;
  nodeData: Node["data"];
}

interface CalcFKPKShowProps {
  field: Field;
  header: Header;
}

interface RenderBodyProps {
  fields: Field[];
  calcWidth?: (key: string) => number;
}

const Table = forwardRef<TableInstance, TableProps>(({ node }, ref) => {
  const data = node.data;
  const store = (node as any).store;
  const id = node.id;
  const size = node.size();
  const linkData = JSON.parse(node.getProp("link") || "{}");
  const allFk =
    node?.model
      ?.getIncomingEdges(id)
      ?.map((t) => t.getTargetPortId().split("%")[0]) || [];
  const onDragOver = (e: any) => {
    e?.preventDefault();
  };
  const onDrop = (e: any) => {
    (store?.data as ER)?.updateFields({
      originKey: store.data.originKey,
      fields: JSON.parse(e.dataTransfer.getData("fields")),
    });
  };
  const nodeClickText = () => {
    (store?.data as ER)?.nodeTextClick({
      node,
    });
  };
  const validateSelected = ({ field, nodeData }: ValidateSelectedProps) => {
    const fieldTargetPort = `${field.id}%in`;
    const fieldSourcePort = `${field.id}%out`;
    const { targetPort, sourcePort } = nodeData;
    return (
      targetPort === fieldTargetPort ||
      targetPort === fieldSourcePort ||
      sourcePort === fieldTargetPort ||
      sourcePort === fieldSourcePort
    );
  };
  const calcFKPKShow = ({ field: f, header: h }: CalcFKPKShowProps) => {
    if (h.refKey === "primaryKey") {
      if (f[h.refKey]) {
        return "<PK>";
      } else if (allFk.includes(f.id)) {
        return "FK";
      }
    } else if (h.refKey === "notNull") {
      if (f[h.refKey]) {
        return `NOTNULL`;
      }
      return "";
    }
    return f[h.refKey];
  };

  const sliceCount = Math.floor((size.height - 31) / 23);
  const renderBody = useMemoizedFn(({ fields, calcWidth }: RenderBodyProps) => {
    return fields.map((f) => {
      return (
        <div
          key={`${f.id}${f.defName}`}
          className={`${
            validateSelected({ field: f, nodeData: store.data })
              ? "luban-er-table-body-selected"
              : ""
          } ${f.primaryKey ? "luban-er-table-body-primary" : ""}`}
        >
          {(data.headers as Header[])
            .filter((h) => h.refKey !== "primaryKey")
            .map((h) => {
              const label = calcFKPKShow({ field: f, header: h });
              return (
                <Tooltip
                  key={h.refKey}
                  content={
                    typeof label === "string"
                      ? label.replace(/\r|\n|\r\n/g, "")
                      : label
                  }
                >
                  {
                    <span
                      style={{
                        width: calcWidth(h.refKey),
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      key={h.refKey}
                    >
                      {typeof label === "string"
                        ? label.replace(/\r|\n|\r\n/g, "")
                        : label}
                    </span>
                  }
                </Tooltip>
              );
            })}
        </div>
      );
    });
  });
  const body = useMemo(() => {
    return (
      <div className="luban-er-table-body">
        {renderBody({
          fields: data.fields.slice(0, sliceCount),
          calcWidth: (key) => {
            return data.maxWidth[key];
          },
        })}
        {data.fields.length > sliceCount && (
          <Tooltip
            content={
              <div
                className="luban-er-table-body"
                style={{
                  fontSize: "12px",
                  overflow: "auto",
                }}
              >
                {renderBody({
                  fields: data.fields.slice(sliceCount),
                  calcWidth: (key) => {
                    return data.originWidth[key];
                  },
                })}
              </div>
            }
          >
            <div
              style={{
                textAlign: "center",
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                cursor: "pointer",
              }}
            >
              ...
            </div>
          </Tooltip>
        )}
      </div>
    );
  }, [data.fields, data.maxWidth, data.originWidth, renderBody, sliceCount]);
  const title = `${getTitle(data)}${
    store?.data.count > 0 ? `:${store?.data.count}` : ""
  }`;
  return (
    <div
      ref={ref as any}
      className="luban-er-table"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Tooltip content={title}>
        <div
          className="luban-er-table-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px",
          }}
        >
          <div
            className="title"
            style={{
              maxWidth: "calc(100% - 60px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>
          <div className="states">未物化</div>
        </div>
      </Tooltip>
      {body}
    </div>
  );
});
console.log("Table: ", Table);

export default Table;
