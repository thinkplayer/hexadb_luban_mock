import { memo, useState } from "react";
import { Tabs } from "@arco-design/web-react";

import styles from "./index.module.less";
import "@antv/x6-react-shape";
import CanvasWrap from "./components/CanvasWrap";
const TabPane = Tabs.TabPane;
let count = 5;
const initTabs = [...new Array(count)].map((_x, i) => ({
  title: `Tab ${i + 1}`,
  key: `key${i + 1}`,
  content: `${i + 1}`,
}));

const DataModel = memo(() => {
  const [tabs, setTabs] = useState(initTabs);
  const [activeTab, setActiveTab] = useState("key2");

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

  return (
    <div className={styles.dataModel}>
      <Tabs
        editable
        type="card-gutter"
        activeTab={activeTab}
        onAddTab={handleAddTab}
        onDeleteTab={handleDeleteTab}
        onChange={setActiveTab}
      >
        {tabs.map((x) => (
          <TabPane key={x.key} title={x.title}>
            <CanvasWrap />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
});

export default DataModel;
