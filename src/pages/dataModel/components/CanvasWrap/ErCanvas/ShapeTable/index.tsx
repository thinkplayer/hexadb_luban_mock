import TableComponent from "@arco-design/web-react/es/Table";
import styles from "./index.module.less";
import { TableColumnProps } from "@arco-design/web-react";
import { Node } from "@antv/x6";
import { memo } from "react";

interface TableProps {
  node?: Node;
}

const Table = memo((props: TableProps) => {
  console.log("Table-props: ", props);
  const { node } = props;
  const { data } = node;
  const { fields = [] } = data;
  const columns: TableColumnProps[] = [
    {
      title: "Name",
      dataIndex: "displayName",
      render: (_, item) => {
        return `${item.displayName}（${item.name}）`;
      },
    },
  ];

  return (
    <div className={styles.Table}>
      <div className={styles.header}>{data.displayName}</div>
      <TableComponent
        columns={columns}
        data={fields}
        pagination={false}
        showHeader={false}
      />
    </div>
  );
});

export default Table;
