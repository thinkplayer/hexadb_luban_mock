import { useState } from "react";
import { Tabs } from "@arco-design/web-react";
import styles from "./index.module.less";
import ErCanvas from "./components/ErCanvas";
import RefResizeObserver from "rc-resize-observer";
const TabPane = Tabs.TabPane;
let count = 5;
const initTabs = [...new Array(count)].map((_x, i) => ({
  title: `Tab ${i + 1}`,
  key: `key${i + 1}`,
  content: `${i + 1}`,
}));
const DataModel = () => {
  const [tabs, setTabs] = useState(initTabs);
  const [activeTab, setActiveTab] = useState("key2");
  const [size, updateSize] = useState({ width: 0, height: 0 });

  const handleAddTab = () => {
    const newTab = {
      title: `New Tab${++count}`,
      key: `new key${count}`,
      content: `${count}`,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.key);
  };

  const handleDeleteTab = (key: string) => {
    const index = tabs.findIndex((x) => x.key === key);
    const newTabs = tabs.slice(0, index).concat(tabs.slice(index + 1));

    if (key === activeTab && index > -1 && newTabs.length) {
      setActiveTab(
        newTabs[index] ? newTabs[index].key : newTabs[index - 1].key
      );
    }

    if (index > -1) {
      setTabs(newTabs);
    }
  };

  const onResize = ({ width, height }: { width: number; height: number }) => {
    updateSize({ width, height });
  };

  return (
    <div className={styles.dataModel}>
      <Tabs
        editable
        type="card-gutter"
        activeTab={activeTab}
        onAddTab={handleAddTab}
        onDeleteTab={handleDeleteTab}
        onChange={setActiveTab}
        className={styles.Tabs}
      >
        {tabs.map((x) => (
          <TabPane
            key={x.key}
            title={x.title}
            destroyOnHide
            style={{ width: "100%", height: "100%" }}
          >
            <RefResizeObserver onResize={onResize}>
              <div style={{ width: "100%", height: "100%" }}>
                <ErCanvas width={size.width} height={size.height} />
              </div>
            </RefResizeObserver>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default DataModel;
