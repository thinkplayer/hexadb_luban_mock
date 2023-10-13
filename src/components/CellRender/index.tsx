import {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./cell.module.less";
import { Message, Tooltip } from "@arco-design/web-react";
import copyToClipboard from "copy-to-clipboard";
import { IconCopy } from "@arco-design/web-react/icon";
import { EitherOr } from "../../sharedTypes";
import classNames from "classnames";
import ResizeObserver from "rc-resize-observer";
import { useMemoizedFn } from "ahooks";
import { calcSize } from "../LubanTooltip";

interface Options {
  debug?: boolean;
  message?: string;
  format?: string; // MIME type
  onCopy?: (clipboardData: object) => void;
}

export interface CellRenderProps<T = any> {
  /**
   *
   */
  className?: string;
  // text: string | number;
  text: ReactNode;
  // fontSize?: number;
  style?: React.CSSProperties;
  /**
   * 单元格的key
   */
  rowKey?: string;
  record?: T;
  index?: number;
  onCopy?: (text: string, successful?: boolean) => void;
  /**
   * 是否启用复制
   */
  copy?: boolean;
  copyOption?: Options;
  /**
   * 自定义取值逻辑
   * @param item
   * @returns
   */
  render: (text: ReactNode, item: T, index: number) => string;

  getPopupContainer?: (node: HTMLElement) => Element;

  /**
   * 不使用message提示
   */
  doNotNotification?: boolean;

  tooltipDisabled?: boolean;

  displayRow?: number;
}

/**
 * 计算文本长度
 * @param text
 * @returns
 */

/**
 * Table 单元格渲染
 * @param props
 * @returns
 */
const CellRender = <T = any,>(
  props: EitherOr<CellRenderProps<T>, "text", "render">
) => {
  const outerContainerRef = useRef<HTMLDivElement>();
  const {
    text,
    copy,
    rowKey,
    render,
    record,
    index,
    getPopupContainer,
    onCopy,
    doNotNotification,
    style,
    className,
    tooltipDisabled,
    displayRow,
  } = props;
  const styleRef = useRef(style);
  styleRef.current = style;
  const displayText = useMemo(() => {
    if (render) {
      return render(text, record, index);
    }
    // 为 0 时也要显示
    if (text !== null && text !== undefined && text !== "") {
      return text.toString();
    }
    return "-";
  }, [index, record, render, text]);

  const textWidth = useMemo(() => {
    const { width } = calcSize(displayText, styleRef.current);
    if (displayRow && displayRow > 1) {
      return width / Math.ceil(displayRow);
    }
    return width;
  }, [displayText, displayRow]);

  const [ellipsis, setIsEllipse] = useState(false);

  const onResize = useMemoizedFn(({ offsetWidth }) => {
    // const width = Math.ceil(offsetWidth);
    const width = offsetWidth;
    // 16px 是复制的图标的宽度，6px 是字体图标跟右侧文字的宽度，12px 是 ... 的宽度
    const innerWidth = copy ? width - 16 - 6 : width;
    setIsEllipse(textWidth > innerWidth);
  });

  const doCopy = (evt: React.MouseEvent) => {
    const flag = copyToClipboard(displayText, props.copyOption);
    if (onCopy) {
      onCopy(displayText, flag);
    }
    if (flag && !doNotNotification) {
      Message.success("复制成功");
    }
    evt.stopPropagation();
  };

  const labelStyle = useMemo<CSSProperties>(() => {
    if (!displayRow || displayRow === 1) {
      return null;
    }
    return {
      display: "-webkit-box",
      WebkitLineClamp: displayRow,
      WebkitBoxOrient: "vertical",
      whiteSpace: "unset",
      wordBreak: "break-all",
    };
  }, [displayRow]);

  const textRender = useMemo(
    () => (
      <div
        style={labelStyle}
        className={classNames(styles.textWrapper, className)}
      >
        {displayText}
      </div>
    ),
    [labelStyle, className, displayText]
  );

  useEffect(() => {
    const { width } = outerContainerRef.current.getBoundingClientRect();
    // 16px 是复制的图标的宽度，6px 是字体图标跟右侧文字的宽度，12px 是 ... 的宽度
    const innerWidth = copy ? width - 16 - 6 : width;
    setIsEllipse(textWidth > innerWidth);
  }, [copy, textWidth]);

  return (
    <ResizeObserver onResize={onResize}>
      <div
        key={rowKey}
        ref={outerContainerRef}
        className={classNames(styles.cellRender, {
          cxcx: ellipsis,
        })}
      >
        {copy ? (
          <IconCopy onClick={doCopy} className={styles.copyIcon} />
        ) : null}
        {ellipsis ? (
          <Tooltip
            disabled={tooltipDisabled}
            getPopupContainer={getPopupContainer}
            content={text}
          >
            {textRender}
          </Tooltip>
        ) : (
          textRender
        )}
      </div>
    </ResizeObserver>
  );
};

export default CellRender;
