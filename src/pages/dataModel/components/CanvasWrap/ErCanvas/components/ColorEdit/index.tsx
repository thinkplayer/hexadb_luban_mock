import ReactDOM from "react-dom";
import { getPresetColors } from "../../_util/dataSource_util";
import { Button, Icon } from "@arco-design/web-react";
import DragCom from "../DragCom";
import Colorpicker from "../Colorpicker";

export interface ColorEditProps {
  onUpdate: any;
  useDefaultColor?: any;
  close: any;
  id: string;
  position: {
    left: number;
    top: number;
  };
  getDataSource: any;
  movePosition: any;
  color: any;
}

const ColorEdit = ({
  onUpdate,
  useDefaultColor,
  close,
  id,
  position,
  getDataSource,
  movePosition,
  color,
}: ColorEditProps) => {
  const standardColor = getPresetColors();
  const recentColors = getDataSource().profile?.recentColors || [];
  const currentColor = color;
  const openPicker = () => {
    const pickerDom = document.getElementById(`${id}-color-picker`);
    // pickerDom.innerHTML = '';
    pickerDom.setAttribute("class", `luban-node-tooltip-content-color-picker`);
    const Com = DragCom(Colorpicker);
    const onClose = () => {
      ReactDOM.unmountComponentAtNode(pickerDom);
    };
    const refactorPosition = (e: any) => {
      return {
        left: e.left - movePosition.left,
        top: e.top - movePosition.top,
      };
    };
    let tempColor: any;
    const onOk = () => {
      if (tempColor) {
        onUpdate(tempColor, true);
      }
      onClose();
    };
    const _onUpdate = (c: any) => {
      tempColor = c;
    };
    ReactDOM.render(
      <Com
        refactorPosition={refactorPosition}
        defaultColor={currentColor}
        onChange={_onUpdate}
        closeable
        onClose={onClose}
        isSimple
        recentColors={[]}
        footer={
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            <Button type="primary" onClick={onOk}>
              确定
            </Button>
          </div>
        }
        style={{
          left: `${position.left + 10}px`,
          top: `${position.top}px`,
          zIndex: 999,
        }}
      />,
      pickerDom
    );
  };
  const _close = () => {
    openPicker();
    close && close();
  };
  return (
    <div className={`luban-node-tooltip-content-color-edit`}>
      <div className={`luban-node-tooltip-content-color-edit-container`}>
        <div
          className={`luban-node-tooltip-content-color-edit-container-label`}
        >
          <span>我的颜色</span>
          <span
            onClick={useDefaultColor}
            className={`luban-node-tooltip-content-color-edit-container-label-default`}
          >
            使用默认颜色
          </span>
        </div>
        <div className={`luban-node-tooltip-content-color-edit-container-list`}>
          <div
            onClick={_close}
            className={`luban-node-tooltip-content-color-edit-container-list-item-normal`}
          >
            <Icon type="fa-plus" />
          </div>
          {recentColors.map((s: any) => {
            return (
              <div
                onClick={() => onUpdate({ hex: s }, false)}
                className={`luban-node-tooltip-content-color-edit-container-list-item-${
                  currentColor === s ? "selected" : "normal"
                }`}
                key={s}
                style={{ background: s }}
              />
            );
          })}
        </div>
      </div>
      <div className={`luban-node-tooltip-content-color-edit-container`}>
        <div
          className={`luban-node-tooltip-content-color-edit-container-label`}
        >
          标准颜色
        </div>
        <div className={`luban-node-tooltip-content-color-edit-container-list`}>
          {standardColor.map((s) => {
            return (
              <div
                onClick={() => onUpdate({ hex: s }, false)}
                className={`luban-node-tooltip-content-color-edit-container-list-item-${
                  currentColor === s ? "selected" : "normal"
                }`}
                key={s}
                style={{ background: s }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColorEdit;
