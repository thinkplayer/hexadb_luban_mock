/**
 * MetaModelEntityVO，实体
 */
export interface EntityDetail {
  /**
   * 属性列表
   */
  attributes?: EntityDetailAttributes[];
  /**
   * 描述
   */
  description?: string;
  /**
   * 中文名
   */
  displayName?: string;
  /**
   * 业务域标识
   */
  domainId?: string;
  /**
   * id
   */
  id?: string;
  /**
   * 物化标记
   */
  materializedFlag?: boolean;
  /**
   * 英文名
   */
  name?: string;
  /**
   * 数据表标识
   */
  tableId?: string;
}

/**
 * MetaModelEntityAttributeDTO，实体属性
 */
export interface EntityDetailAttributes {
  /**
   * 字段标识
   */
  columnId?: string;
  /**
   * 字段类型长度定义
   */
  dataLength?: number;
  /**
   * 字段类型精度定义
   */
  dataPrecision?: number;
  /**
   * 数据类型名
   */
  dataType?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 中文名
   */
  displayName?: string;
  /**
   * 显示顺序
   */
  displayOrder?: number;
  /**
   * 实体标识
   */
  entityId?: string;
  /**
   * id
   */
  id?: string;
  /**
   * 英文名
   */
  name?: string;
  /**
   * 是否必填
   */
  notNullFlag?: boolean;
}

/**
 * 列表数据，业务域
 */
export interface DomainListItem {
  /**
   * id
   */
  id?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 拼音名
   */
  pinyinName?: string;
}

export interface DataTypesItem {
  /** 数据类型名（例如 VARCHAR） */
  code: string;
  /** 中文名、显示名 */
  name: string;
  /** 可设置长度 */
  lengthFlag: boolean;
  /** 长度最小值（大于等于1） */
  lengthMin: number;
  /** 长度最大值（应小于10485760） */
  lengthMax: number;
  /** 可设置精度 */
  precisionFlag: boolean;
  /** 精度最小值（一般为零） */
  precisionMin: number;
  /** 精度最大值（应小于1000） */
  precisionMax: number;
  /** 数据类型ID */
  id: string;
}

export interface DomainDetail {
  /**
   * 图数据
   */
  diagramSet?: string;
  /**
   * id
   */
  id?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 拼音名
   */
  pinyinName?: string;
  /**
   * 待处理数据
   */
  todoList?: DomainDetailTodoListItem[];
  /**
   * 版本号
   */
  version?: number;
}
export interface DomainDetailTodoListItem {
  /**
   * 属性列表
   */
  attributes?: DomainDetailTodoListItemAttributesItem[];
  /**
   * 是否被删除标识
   */
  deletedFlag?: boolean;
  /**
   * 描述
   */
  description?: string;
  /**
   * 中文名
   */
  displayName?: string;
  /**
   * 业务域标识
   */
  domainId?: string;
  /**
   * id
   */
  id?: string;
  /**
   * 物化标记
   */
  materializedFlag?: boolean;
  /**
   * 英文名
   */
  name?: string;
  /**
   * 数据表标识
   */
  tableId?: string;
}
export interface DomainDetailTodoListItemAttributesItem {
  /**
   * 字段标识
   */
  columnId?: string;
  /**
   * 字段类型长度定义
   */
  dataLength?: number;
  /**
   * 字段类型精度定义
   */
  dataPrecision?: number;
  /**
   * 数据类型名
   */
  dataType?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 中文名
   */
  displayName?: string;
  /**
   * 显示顺序
   */
  displayOrder?: number;
  /**
   * 实体标识
   */
  entityId?: string;
  /**
   * id
   */
  id?: string;
  /**
   * 英文名
   */
  name?: string;
  /**
   * 是否必填
   */
  notNullFlag?: boolean;
}
