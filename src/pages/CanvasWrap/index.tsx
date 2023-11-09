import { Divider, Drawer, Link } from "@arco-design/web-react";
import styles from "./index.module.less";
import ErCanvas from "./components/ErCanvas";
import RefResizeObserver, { SizeInfo } from "rc-resize-observer";
import { useMemoizedFn } from "ahooks";
import { useRef, useState } from "react";
import EntityDataEdit, {
  EntityDataEditInstance,
} from "./components/EntityDataEdit";
import { dataTypeList } from "./mockData";

export interface CanvasWrapProps {}

/**
 *
 */
const CanvasWrap = (props: CanvasWrapProps) => {
  const [canvasSize, setCanvasSize] = useState<SizeInfo>(null);
  const onResize = useMemoizedFn((size) => {
    setCanvasSize(size);
  });

  const [entityDataEditVisible, setEntityDataEditVisible] =
    useState<boolean>(false);
  const EntityDataEditRef = useRef<EntityDataEditInstance>(null);

  const handleSaveEntityData = useMemoizedFn(async () => {
    const entityData = await EntityDataEditRef.current.getData();
    console.log(
      "🚀 ~ file: index.tsx:29 ~ handleSaveEntityData ~ entityData:",
      entityData
    );
    // setEntityDataEditVisible(false);
  });

  return (
    <div className={styles.canvasWrap}>
      <div className={styles.headerWrap}>
        <div className={styles.searchWrap}></div>
        <div className={styles.optionsWrap}>
          <Link onClick={() => setEntityDataEditVisible(true)}>新建实体</Link>
          <Divider type="vertical" />
          <Link>物化</Link>
        </div>
      </div>

      <RefResizeObserver onResize={onResize}>
        <div className={styles.erCanvasWrap}>
          <ErCanvas size={canvasSize} />
        </div>
      </RefResizeObserver>

      <Drawer
        title="实体数据编辑"
        placement="right"
        closable={false}
        visible={entityDataEditVisible}
        width={1200}
        maskClosable={false}
        unmountOnExit
        onOk={handleSaveEntityData}
        onCancel={() => setEntityDataEditVisible(false)}
      >
        <EntityDataEdit
          ref={EntityDataEditRef}
          entityDetail={{}}
          dataTypeList={dataTypeList}
        />
      </Drawer>
    </div>
  );
};

export default CanvasWrap;
