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
import {
  DataTypesItem,
  DomainDetailTodoListItemAttributesItem,
  EntityDetail,
} from "../ErCanvas/shared";
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

interface EditableCellProps {
  dataTypeList: DataTypesItem[];
  [key: string]: any;
}

function EditableCell(props: EditableCellProps) {
  const { children, rowData, column, onHandleSave, dataTypeList = [] } = props;
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
          {["dataType"].includes(column.dataIndex) ? (
            <Select
              allowClear
              placeholder={column.placeholder}
              defaultValue={rowData[column.dataIndex]}
              filterOption={filterOption}
            >
              {dataTypeList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.code}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          ) : ["operation"].includes(column.dataIndex) ? (
            <Space>
              <Link>删除</Link>
            </Space>
          ) : ["displayName", "name", "description"].includes(
              column.dataIndex
            ) ? (
            <Input
              showWordLimit={!!column.maxLength}
              maxLength={column.maxLength}
              placeholder={column.placeholder}
            />
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
  getData: () => DomainDetailTodoListItemAttributesItem[];
}

export interface EditableTableProps {
  entityDetail?: EntityDetail;
  /** 数据类型列表 */
  dataTypeList?: DataTypesItem[];
  isAdd?: boolean;
}

const EditableTable = forwardRef<EditableTableInstance, EditableTableProps>(
  (props, ref) => {
    const { entityDetail, dataTypeList = [], isAdd } = props;
    useImperativeHandle(ref, () => {
      return {
        getData: () => data,
      };
    });

    const [data, setData] = useState<DomainDetailTodoListItemAttributesItem[]>(
      []
    );

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
        placeholder: "请输入属性中文名",
        maxLength: 100,
      },
      {
        title: "属性英文名",
        dataIndex: "name",
        editable: true,
        placeholder: "请输入属性英文名",
        maxLength: 60,
      },
      {
        title: "属性类型",
        dataIndex: "dataType",
        editable: true,
        placeholder: "请选择属性类型",
        width: 180,
      },
      {
        title: "描述",
        dataIndex: "description",
        editable: true,
        placeholder: "请输入描述",
        maxLength: 200,
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (_: any, record: any) => (
          <Link onClick={() => removeRow(record.id)}>删除</Link>
        ),
      },
    ];

    function handleSave(row: any) {
      const newData = [...data];
      const index = newData.findIndex((item) => row.id === item.id);
      newData.splice(index, 1, { ...newData[index], ...row });
      setData(newData);
    }

    function removeRow(key: any) {
      setData(data.filter((item) => item.id !== key));
    }

    const addRow = useMemoizedFn(() => {
      const slug = cuid.slug();
      function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
      }

      // setData(
      // 	data.concat({
      // 		id: cuid(),
      // 		displayName: undefined,
      // 		name: undefined,
      // 		dataType: undefined,
      // 		description: undefined
      // 	})
      // );

      // TODO 模拟新增， 测试前删除
      const randomRow = {
        id: cuid(),
        displayName: `属性中文名_${slug}`,
        name: `attr_name_${slug}`,
        dataType: dataTypeList[getRandomInt(0, 13)].code,
        description: `属性描述_${slug}`,
      };
      setData(data.concat(randomRow));
    });

    useEffect(() => {
      if (entityDetail?.attributes?.length) {
        setData(entityDetail?.attributes);
      } else if (isAdd) {
        addRow();
      }
    }, [addRow, entityDetail?.attributes, isAdd]);

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
          rowKey={"id"}
          columns={columns.map((column) =>
            column.editable
              ? {
                  ...column,
                  onCell: () => ({
                    onHandleSave: handleSave,
                    dataTypeList,
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
