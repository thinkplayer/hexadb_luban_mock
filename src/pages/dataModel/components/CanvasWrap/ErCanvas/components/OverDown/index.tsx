import React, {
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

export interface OverDownProps {
  children: ReactElement;
  over: ReactElement;
  offset: number;
}

export interface OverDownInstance {
  close: () => void;
}

const OverDown = forwardRef<OverDownInstance, OverDownProps>(
  ({ children, over, offset = 0 }, ref) => {
    const [dataPosition, setDataPosition] = useState(null);
    const isLeave = useRef(true);
    const time = useRef(null);
    useImperativeHandle(
      ref,
      () => {
        return {
          close: () => {
            clearTimeout(time.current);
            setDataPosition(null);
            isLeave.current = true;
          },
        };
      },
      []
    );
    const checkLeave = () => {
      clearTimeout(time.current);
      time.current = setTimeout(() => {
        if (isLeave.current) {
          setDataPosition(null);
        }
      }, 300);
    };
    const onMouseOver = (e: any) => {
      const checkIsChildren: (dom: Element) => boolean = (dom) => {
        // luban-tooltip-content
        if (
          (dom.getAttribute("class") || "").includes(`luban-tooltip-content`)
        ) {
          return false;
        } else if (dom.parentElement && dom.parentElement !== document.body) {
          return checkIsChildren(dom.parentElement);
        }
        return true;
      };
      if (checkIsChildren(e.target)) {
        isLeave.current = false;
        checkLeave();
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        setDataPosition({
          left: rect.x + rect.width / 2 - offset,
          top: rect.bottom + 8,
        });
      } else {
        isLeave.current = true;
        checkLeave();
      }
    };
    const onMouseLeave = () => {
      isLeave.current = true;
      checkLeave();
    };
    const onMouseOverData = () => {
      isLeave.current = false;
      checkLeave();
    };
    const onMouseLeaveData = () => {
      isLeave.current = true;
      checkLeave();
    };
    return (
      <>
        {React.cloneElement(children, {
          onMouseOver,
          onMouseLeave,
        })}
        {dataPosition &&
          ReactDOM.createPortal(
            <div
              onMouseLeave={onMouseLeaveData}
              onMouseOver={onMouseOverData}
              className={`luban-edge-tooltip-content-item-data`}
              style={dataPosition}
            >
              {over}
            </div>,
            document.body
          )}
      </>
    );
  }
);

export default OverDown;
