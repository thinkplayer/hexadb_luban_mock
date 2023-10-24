import React, { forwardRef, useState } from "react";
import { SketchPicker } from "react-color";
import "./style/index.less";
import { Icon } from "@arco-design/web-react";
import { getPresetColors } from "../../_util/dataSource_util";

interface ColorpickerProps {
  onChange: any;
  recentColors: any;
  defaultColor: any;
  restColor: any;
  isSimple: any;
  style: any;
  closeable: any;
  footer: any;
  onClose: any;
  [key: string]: any;
}

interface ColorpickerInstance {}

const Colorpicker = React.memo(
  forwardRef<ColorpickerInstance, ColorpickerProps>(
    (
      {
        onChange,
        recentColors,
        defaultColor,
        restColor,
        isSimple,
        style,
        closeable,
        footer,
        onClose,
        ...restProps
      },
      ref
    ) => {
      const [currentColor, setCurrentColor] = useState(defaultColor);
      const currentPrefix = "luban";
      const _onChange = (color: any) => {
        setCurrentColor(color.hex);
        onChange && onChange(color);
      };
      const onChangeComplete = (color: any) => {
        onChange && onChange(color, true);
      };
      const _iconClose = () => {
        onClose && onClose();
      };
      const realValue = "color" in restProps ? restProps.color : currentColor;
      return (
        <div
          className={`${currentPrefix}-color-picker`}
          style={style}
          ref={ref as any}
        >
          {closeable && (
            <div className={`${currentPrefix}-color-picker-header`}>
              颜色选择
              <Icon
                className={`${currentPrefix}-color-picker-header-icon`}
                type="fa-times"
                onClick={_iconClose}
              />
            </div>
          )}
          <SketchPicker
            disableAlpha
            presetColors={getPresetColors()}
            color={realValue}
            onChange={_onChange}
            onChangeComplete={onChangeComplete}
          />
          {!isSimple && (
            <div className={`${currentPrefix}-color-picker-footer`}>
              <div>最近使用的颜色</div>
              <div>
                {recentColors.map((r: any) => {
                  return (
                    <div
                      onClick={() => onChange({ hex: r })}
                      key={r}
                      title={r}
                      style={{ background: r }}
                      className={`${currentPrefix}-color-picker-footer-item`}
                    >
                      {}
                    </div>
                  );
                })}
              </div>
              <div>
                <a onClick={() => onChange({ hex: restColor })}>恢复默认</a>
              </div>
            </div>
          )}
          {footer}
        </div>
      );
    }
  )
);
export default Colorpicker;
