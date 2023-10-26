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
    console.log(
      "handleSaveEntity-data: ",
      data,
      erCanvasRef.current.getDataSource()
    );
    // TODO 更新源数据中
    console.log("handleSaveEntity-dataSource: ", dataSource);
    console.log("handleSaveEntity-currentEntity: ", currentEntity);
    if (currentEntity) {
      // 编辑实体
      dataSource.entities.forEach((item) => {
        if (item.id === currentEntity.data.id) {
          item.fields = data.fields;
        }
      });
    } else {
      // 新增实体
      const data = erCanvasRef.current.getDataSource();
      console.log("handleSaveEntity-data: ", data);
      // erCanvasRef.current.getGraph().addNode({
      //   id: "c5ccdc76-b8e3-438f-bc7c-ed92a10e7346",
      //   shape: "table",
      //   position: {
      //     x: -193.99999999999943,
      //     y: 149.99999999999915,
      //   },
      //   count: 0,
      //   originKey: "0FC9DB49-4FDB-437E-83E9-7EE803F1CC84",
      //   fillColor: "rgb(183, 185, 189)",
      // });
    }

    erCanvasRef.current.update(dataSource);
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
