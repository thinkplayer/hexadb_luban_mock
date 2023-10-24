import { Edge } from "@antv/x6";
import { useRef, useState } from "react";
import { OnUpdateProps } from "../tools";
import { Icon, Tooltip } from "@arco-design/web-react";
import OverDown from "../OverDown";
import ColorEdit from "../ColorEdit";
import Svg from "../Svg";
import { IconSwap } from "@arco-design/web-react/icon";
export interface EdgeTooltipContentProps {
  id: string;
  position: {
    left: number;
    top: number;
  };
  getDataSource: any;
  movePosition: any;
  edge: Edge;
  onUpdate: any;
}

const EdgeTooltipContent = (props: EdgeTooltipContentProps) => {
  const { edge, onUpdate, movePosition, getDataSource, position, id } = props;
  const overDownFillRef = useRef(null);
  const defaultColor = {
    fillColor: "#ACDAFC",
    fontColor: "#000000",
  };
  const [fillColor, setFillColor] = useState(
    edge.getProp("fillColor") || defaultColor.fillColor
  );
  const [arrowState, setArrowState] = useState(() => {
    const attr = edge.attr("line") as any;
    // triangle-stroke
    return [
      attr?.sourceMarker?.relation || "none",
      attr?.targetMarker?.relation || "none",
    ].map((r) => (r === "arrow" ? "triangle-stroke" : r));
  });
  const [lineState, setLineState] = useState(() => {
    return {
      lineStyle:
        edge.attr("line/strokeDasharray") === "5 5"
          ? "dotted-large"
          : "#icon-stroke-line1",
      // eslint-disable-next-line no-nested-ternary
      lineType:
        edge.getProp("router")?.name === "normal"
          ? "straight"
          : edge.getProp("connector")?.name === "rounded"
          ? "fillet"
          : "polyline",
    };
  });
  const arrowType = [
    "none",
    "triangle-stroke",
    "triangle-fill",
    "right",
    "concave",
  ];
  const erArrowType = ["1", "n"];
  const lineType = ["straight", "polyline", "fillet"];
  const lineStyle = ["#icon-stroke-line1", "dotted-large"];
  const _onUpdate = ({ type, value, reverse }: OnUpdateProps) => {
    console.log("_onUpdate-{ type, value, reverse }: ", {
      type,
      value,
      reverse,
    });
    if (type === "relation" || type === "arrow-exchange") {
      setArrowState((pre) => {
        if (type === "arrow-exchange") {
          return [pre[1], pre[0]];
        } else if (reverse) {
          return [value, pre[1]];
        }
        return [pre[0], value];
      });
    } else if (type === "lineType" || type === "lineStyle") {
      setLineState((pre) => {
        return {
          ...pre,
          [type]: value,
        };
      });
    } else if (type === "fillColor") {
      setFillColor(value.hex);
    }
    onUpdate?.({ type, value, reverse });
  };

  const fillClose = () => {
    overDownFillRef.current.close();
  };
  const renderDataType = (type: string, reverse?: boolean) => {
    if (type === "line") {
      return (
        <div className={`luban-edge-tooltip-content-item-data-line`}>
          <div>
            <div>线条类型</div>
            <div>
              {lineType.map((t) => {
                return (
                  <Svg
                    className={
                      lineState.lineType === t
                        ? `luban-edge-tooltip-content-item-data-line-selected`
                        : ""
                    }
                    key={t}
                    type={t}
                    isArrow={false}
                    onClick={() => _onUpdate({ type: "lineType", value: t })}
                  />
                );
              })}
            </div>
          </div>
          <div>
            <div>线条样式</div>
            <div>
              {lineStyle.map((s) => {
                return (
                  <Svg
                    className={
                      lineState.lineStyle === s
                        ? `luban-edge-tooltip-content-item-data-line-selected`
                        : ""
                    }
                    key={s}
                    type={s}
                    isArrow={false}
                    onClick={() => _onUpdate({ type: "lineStyle", value: s })}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`luban-edge-tooltip-content-item-data-arrow`}>
        {arrowType.concat(erArrowType).map((a) => {
          return (
            <div
              className={
                a === "1"
                  ? `luban-edge-tooltip-content-item-data-arrow-border`
                  : ""
              }
              key={a}
              onClick={() => _onUpdate({ type: "relation", value: a, reverse })}
            >
              <div>
                <Icon
                  style={{
                    visibility:
                      a === arrowState[reverse ? 0 : 1] ? "visible" : "hidden",
                  }}
                  type="fa-check"
                />
              </div>
              <Svg reverse={reverse} type={a} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`luban-edge-tooltip-content`}>
      <OverDown
        offset={80}
        ref={overDownFillRef}
        over={
          <ColorEdit
            movePosition={movePosition}
            color={fillColor}
            getDataSource={getDataSource}
            onUpdate={(v: any, complete: any) =>
              _onUpdate({ type: "fillColor", value: v, reverse: complete })
            }
            position={position}
            id={id}
            close={fillClose}
          />
        }
      >
        <div className={`luban-edge-tooltip-content-customer-circle`}>
          <Tooltip content={"填充颜色"}>
            <div
              className={`luban-node-tooltip-content-font-circle`}
              style={{ background: fillColor }}
            />
          </Tooltip>
        </div>
      </OverDown>

      <div className={`luban-edge-tooltip-content-line`} />
      <OverDown over={renderDataType("line")} offset={50}>
        <div className={`luban-edge-tooltip-content-item`}>
          <div className={`luban-edge-tooltip-content-item-line`}>
            <Tooltip content={"线条类型"}>
              <Svg isArrow={false} type={lineState.lineType} />
            </Tooltip>
          </div>
        </div>
      </OverDown>

      <div className={`luban-edge-tooltip-content-line`} />
      <div className={`luban-edge-tooltip-content-item`}>
        <div className={`luban-edge-tooltip-content-item-arrow`}>
          <OverDown over={renderDataType("arrow", true)} offset={25}>
            <div>
              <Tooltip content={"起点箭头"}>
                <Svg reverse type={arrowState[0]} />
              </Tooltip>
            </div>
          </OverDown>
          <div
            onClick={() => _onUpdate({ type: "arrow-exchange" })}
            className={`luban-edge-tooltip-content-item-arrow-change`}
          >
            <Tooltip content={"交换"}>
              <IconSwap />
            </Tooltip>
          </div>
          <OverDown over={renderDataType("arrow")} offset={25}>
            <div>
              <Tooltip content={"终点箭头"}>
                <Svg type={arrowState[1]} />
              </Tooltip>
            </div>
          </OverDown>
        </div>
      </div>
    </div>
  );
};

export default EdgeTooltipContent;
