import React from "react";
import "./style/index.less";

interface SvgProps {
  isArrow?: boolean;
  type: string;
  rotate?: any;
  reverse?: boolean;
  className?: string;
  [key: string]: any;
}

const Svg = React.memo(
  ({
    isArrow = true,
    type,
    rotate,
    reverse = false,
    className = "",
    ...restProps
  }: SvgProps) => {
    const currentPrefix = "luban";
    return (
      <div
        {...restProps}
        className={`${currentPrefix}-er-svg-icon ${className}`}
      >
        <svg
          style={{
            width: "32px",
            height: "32px",
            transform: `rotate(${rotate || (reverse ? "180" : "0")}deg)`,
          }}
        >
          {type?.startsWith("#") ? (
            <use xlinkHref={type} fill="" />
          ) : isArrow ? (
            <use xlinkHref={`#icon-arrow-type-${type}`} fill="" />
          ) : (
            <use xlinkHref={`#icon-line-${type}`} fill="" />
          )}
        </svg>
      </div>
    );
  }
);
export default Svg;
