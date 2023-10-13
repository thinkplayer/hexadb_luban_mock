import { Button, Divider, Drawer } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useRef, useState } from "react";
import ErCanvas, { ErCanvasInstance } from "./ErCanvas";
import EntityDrawer, { EntityDrawerInstance } from "../EntityDrawer";
import { useMemoizedFn } from "ahooks";

const CanvasWrap = () => {
  const erCanvasWrapRef = useRef<HTMLDivElement>();
  const erCanvasRef = useRef<ErCanvasInstance>();
  const entityDrawerRef = useRef<EntityDrawerInstance>();

  const [entityDrawerVisible, setEntityDrawerVisible] = useState(false);

  const graphFromJson = () => {
    const json = erCanvasRef.current.getGraph().toJSON();
    console.log("json: ", json);
  };

  const handleAddNewEntity = () => {
    setEntityDrawerVisible(true);
  };

  const handleSaveEntity = useMemoizedFn(async () => {
    const data = await entityDrawerRef.current.getData();
    console.log("data: ", data);
    const { fields } = data;
    const graph = erCanvasRef.current.getGraph();
    graph.addNode({
      shape: "table",
      width: 400,
      height: fields.length * 41 + 30,
      data,
      x: 200,
      y: 200,
    });

    setEntityDrawerVisible(false);
  });

  return (
    <div className={styles.CanvasWrap}>
      <div className={styles.headerWrap}>
        <div className={styles.searchWrap}></div>
        <div className={styles.optionsWrap}>
          <Button onClick={handleAddNewEntity}>新建实体</Button>
          <Divider type="vertical" />
          <Button onClick={graphFromJson}>保存画布数据</Button>
        </div>
      </div>

      <div className={styles.canvasWrap}>
        <div style={{ height: "100%", width: "100%" }} ref={erCanvasWrapRef}>
          <ErCanvas ref={erCanvasRef} />
        </div>
      </div>

      <Drawer
        width={1200}
        title="新建实体"
        visible={entityDrawerVisible}
        className={styles.drawerWrap}
        onCancel={() => setEntityDrawerVisible(false)}
        onOk={handleSaveEntity}
      >
        <EntityDrawer ref={entityDrawerRef} />
      </Drawer>
    </div>
  );
};

export default CanvasWrap;