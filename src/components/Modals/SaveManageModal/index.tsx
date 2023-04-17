import { PlusCircleOutlined } from "@ant-design/icons";
import { Modal, Table, Button, Popconfirm, Typography, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";

export interface ISaveManageModalProps {
    onOk: () => void;
    onCancel: () => void;
    isDisplay: Readonly<boolean>;
    saveFiles: Readonly<ISaveManageTableRowData[]>,
    onLoad: (slot: number) => void;
    onSave: (slot?: number) => void;
    onDelete: (slot: number) => void;
}

export interface ISaveManageTableRowData {
    slot: number,
    saveTime: string,
};

interface IData extends ISaveManageTableRowData {
    key: React.Key,
};

const SaveManageModal: React.FC<ISaveManageModalProps> = ({
    onCancel: handleCancel,
    onOk: handleOk,
    isDisplay,
    onLoad: handleLoad,
    onSave: handleSave,
    onDelete: handleDelete,
    saveFiles }) => {

    const data = saveFiles.map((val, ind) => ({ key: ind, ...val }));

    const columns: ColumnsType<IData> = [
        {
            title: '槽位', dataIndex: 'slot', key: 'slot', align: 'center', width: 100,
            render: (_, record) => {
                if (record.slot === -1)
                    return (<div>自动保存</div>);
                return (<div>{record.slot}</div>);
            }
        },
        { title: '保存时间', dataIndex: 'saveTime', key: 'saveTime', align: 'center', width: 250 },
        {
            title: '操作', key: 'action', align: 'center',
            render: (_, record) => (
                <Space>
                    <Popconfirm title="确认载入？未保存的流程将被覆盖" onConfirm={() => handleLoad(record.slot)}>
                        <Typography.Link>载入</Typography.Link>
                    </Popconfirm>
                    {record.slot !== 0 && (
                        <>
                            <Popconfirm title="确认覆盖？" onConfirm={() => handleSave(record.slot)}>
                                <Typography.Link>覆盖</Typography.Link>
                            </Popconfirm>
                            <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.slot)}>
                                <Typography.Link>删除</Typography.Link>
                            </Popconfirm>
                        </>
                    )} 
                    {/* TODO: 添加预览 */}
                </Space>
            ),
        },
    ];

    return (
        <Modal
            title='存档管理'
            centered
            open={isDisplay}
            onCancel={handleCancel}
            width={'600px'}
            bodyStyle={{ height: '525px' }}
            footer={[
                <Button onClick={() => handleSave()}><PlusCircleOutlined />保存当前流程</Button>,
                <Button key='cancel' onClick={handleCancel}>关闭</Button>,
                <Button key='ok' type="primary" onClick={handleOk}>确定</Button>,
            ]}
        >
            <Table<IData>
                style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}
                dataSource={data}
                pagination={{ defaultPageSize: 7, hideOnSinglePage: true }}
                bordered
                columns={columns}
            >
            </Table>
        </Modal>
    );
};

export default SaveManageModal;