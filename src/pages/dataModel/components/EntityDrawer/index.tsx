import { Divider, Form, Grid, Input, Select } from "@arco-design/web-react";
import useForm from "@arco-design/web-react/es/Form/useForm";
import styles from "./index.module.less";
import EditableTable, { EditableTableInstance } from "./EdittableTable";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useMemoizedFn } from "ahooks";

const { Col } = Grid;

export interface EntityDrawerInstance {
  getData: () => Promise<any>;
}

export interface EntityDrawerProps {}

const EntityDrawer = forwardRef<EntityDrawerInstance>((props, ref) => {
  const [form] = useForm();
  const EditableTableRef = useRef<EditableTableInstance>();

  useImperativeHandle(ref, () => {
    return {
      getData: getData,
    };
  });

  const getData = useMemoizedFn(async () => {
    const formInfo = await form.validate();
    return {
      ...formInfo,
      fields: EditableTableRef.current.data,
    };
  });

  return (
    <div className={styles.EntityDrawer}>
      <Form
        layout="inline"
        form={form}
        className={styles.formWrap}
        initialValues={{
          // TODO 临时初始化数据
          displayName: "实体中文名",
          name: "实体英文名",
        }}
      >
        <Col span={8}>
          <Form.Item
            label="实体中文名"
            field="displayName"
            rules={[
              {
                required: true,
                message: `请输入实体中文名`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="实体英文名"
            field="name"
            rules={[
              {
                required: true,
                message: `请输入实体英文名`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="关联业务域"
            field="system"
            rules={[
              {
                required: false,
                message: `请选择关联业务域`,
              },
            ]}
          >
            <Select />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="描述" field="desc">
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Form>
      <Divider />

      <EditableTable ref={EditableTableRef} />
    </div>
  );
});

export default EntityDrawer;
