import { Divider, Form, Grid, Input, Select } from "@arco-design/web-react";
import { DomainDetail, DomainListItem, EntityDetail } from "../ErCanvas/shared";
import styles from "./index.module.less";
import useForm from "@arco-design/web-react/es/Form/useForm";
import EditableTable, {
  EditableTableInstance,
  EditableTableProps,
} from "./EdittableTable";
import { forwardRef, useImperativeHandle, useRef } from "react";
import cuid from "cuid";
import { useMemoizedFn } from "ahooks";
const { Col } = Grid;

export interface EntityDataEditInstance {
  getData: () => Promise<EntityDetail>;
}
export interface EntityDataEditProps extends EditableTableProps {
  entityDetail?: EntityDetail;
  domainList?: DomainListItem[];
  domainDetail?: DomainDetail;
}

/**
 *
 */
const EntityDataEdit = forwardRef<EntityDataEditInstance, EntityDataEditProps>(
  (props, ref) => {
    const { entityDetail, domainList, dataTypeList, domainDetail } = props;
    const slug = cuid.slug();
    console.log(
      "🚀 ~ file: index.tsx:13 ~ EntityDataEdit ~ data:",
      entityDetail
    );

    const [form] = useForm();
    const EditableTableRef = useRef<EditableTableInstance>(null);

    useImperativeHandle(ref, () => {
      return {
        getData: getData,
      };
    });

    const getData = useMemoizedFn(async () => {
      const formInfo = await form.validate();
      return {
        ...entityDetail,
        ...formInfo,
        attributes: EditableTableRef.current.getData(),
      };
    });

    return (
      <div className={styles.entityDataEdit}>
        <Form
          layout="inline"
          form={form}
          className={styles.formWrap}
          initialValues={{
            domainId: domainDetail?.id,
            name: `entity_name_${slug}`,
            displayName: `实体中文名${slug}`,
            description: `实体描述${slug}`,
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
              <Input showWordLimit maxLength={100} placeholder="请输入" />
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
              <Input showWordLimit maxLength={60} placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="关联业务域"
              field="domainId"
              rules={[
                {
                  required: false,
                  message: `请选择关联业务域`,
                },
              ]}
            >
              <Select placeholder="请选择">
                {domainList?.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="描述" field="description">
              <Input.TextArea
                showWordLimit
                maxLength={500}
                placeholder="请输入"
              />
            </Form.Item>
          </Col>
        </Form>

        <Divider />

        <EditableTable
          entityDetail={entityDetail}
          isAdd={!entityDetail}
          ref={EditableTableRef}
          dataTypeList={dataTypeList}
        />
      </div>
    );
  }
);

export default EntityDataEdit;
