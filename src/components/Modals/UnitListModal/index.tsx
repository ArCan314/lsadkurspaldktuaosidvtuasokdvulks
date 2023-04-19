import { IUnitModel } from "@/types";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Modal, Table, Button, Form, InputNumber, Input, Popconfirm, Typography, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import './UnitListModal.module.css';


const { Column } = Table;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: IData;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            // message: `请输入 ${title}!`,
                            message: ''
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export interface IUnitListModal {
    onOk: () => void;
    onCancel: () => void;
    isDisplay: boolean;
    units: IUnitModel[];
    onUnitUpdate: (unitId: string | undefined, key: keyof IUnitTableRowData | IUnitModel, val?: unknown) => void;
    onUnitAdd: () => void;
    onUnitDelete: (unitId: string | undefined) => void;
}

export interface IUnitTableRowData {
    id?: string;
    name?: string;
    minInput?: number;
    maxInput?: number;
    startUpCost?: number;
    executeCost?: number;
};

interface IData extends IUnitModel {
    key: React.Key,
};


const UnitListModal: React.FC<IUnitListModal> = ({
    onCancel: handleCancel,
    onOk: handleOk,
    isDisplay,
    units,
    onUnitAdd: handleUnitAdd,
    onUnitDelete: handleUnitDelete,
    onUnitUpdate: handleUnitUpdate }) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<React.Key>('');

    const isEditing = (record: IData) => record.key === editingKey;

    const edit = (record: Partial<IData> & { key: React.Key }) => {
        form.setFieldsValue({ name: '', minInput: 0, maxInput: 0, startUpCost: 0, executeCost: 0, ...record } as IData);
        setEditingKey(record.key);
    };

    const cancel = () => { setEditingKey(''); };

    const save = async (id: string | undefined) => {
        try {
            const row = (await form.validateFields()) as IData;
            handleUnitUpdate(id, { id, ...row });
            setEditingKey('');
        } catch (errInfo) {
            console.info('Validate Failed:', errInfo);
        }
    };

    const columns: ColumnsType<IData> = [
        { title: '设备ID', dataIndex: 'id', key: 'id', editable: false, align: 'center', width: 200, 
            render: (_: unknown, record: IData) => {
                const id = record.id?.split(': ');
                if (id !== undefined && !isNaN(parseInt(id[1])))
                    return <span>{id[1]}</span>;
                return <span>{id}</span>;
            },
        },
        { title: '设备名称', dataIndex: 'name', key: 'name', editable: true, align: 'center', width: 250},
        { title: '最小输入', dataIndex: 'minInput', key: 'minInput', editable: true, align: 'center', width: 100 },
        { title: '最大输入', dataIndex: 'maxInput', key: 'maxInput', editable: true, align: 'center', width: 100 },
        { title: '启动代价', dataIndex: 'startUpCost', key: 'startUpCost', editable: true, align: 'center', width: 100 },
        { title: '处理代价', dataIndex: 'executeCost', key: 'executeCost', editable: true, align: 'center', width: 100 },
        {
            title: '操作', key: 'action', align: 'center', width: 150,
            render: (_: unknown, record: IData) => {
                const editable = isEditing(record);
                return editable ?
                    (
                        <Space>
                            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>保存</Typography.Link>
                            <Popconfirm title="确认取消？" onConfirm={cancel}>
                                <Typography.Link>取消</Typography.Link>
                            </Popconfirm>
                        </Space>
                    ) :
                    (
                        <Space>
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>编辑</Typography.Link>
                            <Popconfirm title="确认删除？" onConfirm={() => handleUnitDelete(record.id)} disabled={editingKey !== ''}>
                                <Typography.Link disabled={editingKey !== ''}>删除</Typography.Link>
                            </Popconfirm>
                        </Space>
                    )

            }
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable)
            return col;
        return {
            ...col,
            onCell: (record: IData) => ({
                record,
                inputType: col.dataIndex === 'name' ? 'text' : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            }),
        };
    });

    return (
        <Modal
            title='设备列表'
            centered
            open={isDisplay}
            onCancel={handleCancel}
            width={'900px'}
            bodyStyle={{ height: '525px' }}
            footer={[
                <Button onClick={handleUnitAdd}><PlusCircleOutlined />添加设备</Button>,
                <Button key='cancel' onClick={handleCancel}>关闭</Button>,
                // <Button key='ok' type="primary" onCanPlay={handleOk}>确定</Button>,
            ]}
        >
            <Form form={form} component={false}>
                <Table
                    style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}
                    components={{ body: { cell: EditableCell } }}
                    dataSource={units.map((val, ind) => { val.key = ind; return val as IData; })}
                    pagination={{ defaultPageSize: 7, hideOnSinglePage: true, onChange: cancel }}
                    bordered
                    rowClassName='editable-row'
                    columns={mergedColumns}
                >
                </Table>
            </Form>

        </Modal>
    );
};

export default UnitListModal;