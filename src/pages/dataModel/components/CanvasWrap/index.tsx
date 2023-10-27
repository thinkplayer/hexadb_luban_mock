import { Button, Divider, Drawer } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useRef, useState } from "react";
import ErCanvas, { ErCanvasInstance } from "./ErCanvas";
import EntityDrawer, { EntityDrawerInstance } from "../EntityDrawer";
import { useMemoizedFn } from "ahooks";
import { Cell } from "@antv/x6";
import dataSource from "./mockDataSource.json";

const CanvasWrap = () => {
  const erCanvasWrapRef = useRef<HTMLDivElement>();
  const erCanvasRef = useRef<ErCanvasInstance>();
  const entityDrawerRef = useRef<EntityDrawerInstance>();
  const [currentEntity, setCurrentEntity] = useState<Cell>(null);
  const dataSourceRef = useRef(dataSource);

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
    data.fields.forEach((f: any) => {
      f.defKey = f.name;
      f.id = f.name;
      f.defName = f.displayName;
    });
    // TODO 更新源数据中
    console.log("handleSaveEntity-dataSource: ", dataSourceRef.current);
    console.log("handleSaveEntity-currentEntity: ", currentEntity);
    if (currentEntity) {
      // 编辑实体
      dataSourceRef.current.entities.forEach((item) => {
        if (item.id === currentEntity.data.id) {
          item.fields = data.fields;
          item.defKey = data.name;
          item.defName = data.displayName;
        }
      });
      erCanvasRef.current.update(dataSourceRef.current);
    } else {
      // 新增实体
      const nodeData = erCanvasRef.current.addNewEntity(data);
      console.log("新增实体-handleSaveEntity-nodeData: ", nodeData);
      dataSourceRef.current.entities.push(nodeData);
    }

    setEntityDrawerVisible(false);
    setCurrentEntity(null);
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
          <ErCanvas
            ref={erCanvasRef}
            setEntityDrawerVisible={setEntityDrawerVisible}
            setCurrentEntity={setCurrentEntity}
            dataSource={dataSource}
          />
        </div>
      </div>

      <Drawer
        width={1200}
        title={currentEntity ? "编辑实体" : "新建实体"}
        visible={entityDrawerVisible}
        className={styles.drawerWrap}
        onCancel={() => {
          setEntityDrawerVisible(false);
          setCurrentEntity(null);
        }}
        onOk={handleSaveEntity}
        unmountOnExit
      >
        <EntityDrawer propsData={currentEntity?.data} ref={entityDrawerRef} />
      </Drawer>
    </div>
  );
};

export default CanvasWrap;
