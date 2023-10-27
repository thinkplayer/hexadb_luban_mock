import React, {
  useState,
  useRef,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  Button,
  Table,
  Select,
  Form,
  FormInstance,
  Space,
  Link,
  Input,
} from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import cuid from "cuid";
import { filterOption } from "../../../../utils/arco";
import CellRender from "../../../../components/CellRender";
const FormItem = Form.Item;
const EditableContext = React.createContext<{ getForm?: () => FormInstance }>(
  {}
);

function EditableRow(props: any) {
  const { children, className, ...rest } = props;
  const refForm = useRef(null);

  const getForm = () => refForm.current;

  return (
    <EditableContext.Provider
      value={{
        getForm,
      }}
    >
      <Form
        style={{ display: "table-row" }}
        children={children}
        ref={refForm}
        wrapper="tr"
        wrapperProps={rest}
        className={`${className} editable-row`}
      />
    </EditableContext.Provider>
  );
}

function EditableCell(props: any) {
  const { children, rowData, column, onHandleSave } = props;
  const ref = useRef(null);
  const { getForm } = useContext(EditableContext);

  const cellValueChangeHandler = useMemoizedFn(() => {
    const form = getForm();
    form.validate([column.dataIndex], (errors, values) => {
      if (!errors || !errors[column.dataIndex]) {
        onHandleSave && onHandleSave({ ...rowData, ...values });
      }
    });
  });

  if (column.editable) {
    return (
      <div ref={ref}>
        <FormItem
          style={{ marginBottom: 0 }}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          initialValue={rowData[column.dataIndex]}
          field={column.dataIndex}
          onChange={cellValueChangeHandler}
        >
          {["type"].includes(column.dataIndex) ? (
            <Select
              allowClear
              placeholder={column.placeholder}
              defaultValue={rowData[column.dataIndex]}
              filterOption={filterOption}
              options={["int", "double"]}
            />
          ) : ["operation"].includes(column.dataIndex) ? (
            <Space>
              <Link>删除</Link>
            </Space>
          ) : ["displayName", "name", "desc"].includes(column.dataIndex) ? (
            <Input />
          ) : (
            (value) => {
              return <CellRender text={value[column.dataIndex]} />;
            }
          )}
        </FormItem>
      </div>
    );
  }

  return children;
}

export interface EditableTableInstance {
  data: any;
}

interface EditableTableProps {
  propsData: any[];
}

const EditableTable = forwardRef<EditableTableInstance, EditableTableProps>(
  (props, ref) => {
    const { propsData = [] } = props;
    useImperativeHandle(ref, () => {
      return {
        data: data,
      };
    });

    const [data, setData] = useState([]);

    const columns = [
      {
        title: "序号",
        width: 80,
        render: (_data: any, _record: any, i: number) => i + 1,
      },
      {
        title: "属性中文名",
        dataIndex: "displayName",
        editable: true,
      },
      {
        title: "属性英文名",
        dataIndex: "name",
        editable: true,
      },
      {
        title: "属性类型",
        dataIndex: "type",
        editable: true,
      },
      {
        title: "描述",
        dataIndex: "desc",
        editable: true,
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (_: any, record: any) => (
          <Link onClick={() => removeRow(record.key)}>删除</Link>
        ),
      },
    ];

    function handleSave(row: any) {
      const newData = [...data];
      const index = newData.findIndex((item) => row.key === item.key);
      newData.splice(index, 1, { ...newData[index], ...row });
      setData(newData);
    }

    function removeRow(key: any) {
      setData(data.filter((item) => item.key !== key));
    }

    const addRow = useMemoizedFn(() => {
      const randomId = cuid.slug();
      setData(
        data.concat({
          key: cuid(),
          displayName: "属性_" + randomId,
          name: "attribute_" + randomId,
          type: "",
          desc: "描述_" + randomId,
        })
      );
    });

    useEffect(() => {
      if (propsData.length) {
        setData(propsData);
      } else {
        addRow();
      }
    }, [addRow, propsData]);

    return (
      <>
        <Table
          data={data}
          pagination={false}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          columns={columns.map((column) =>
            column.editable
              ? {
                  ...column,
                  onCell: () => ({
                    onHandleSave: handleSave,
                  }),
                }
              : column
          )}
          className="table-demo-editable-cell"
        />
        <Button style={{ margin: "10px 0" }} onClick={addRow}>
          新增属性
        </Button>
      </>
    );
  }
);

export default EditableTable;
