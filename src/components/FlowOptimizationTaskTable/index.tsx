import React from 'react';
import { Table, App, Typography } from 'antd';
import _ from 'lodash';
import type { ColumnsType } from 'antd/es/table';


export interface ITaskTableRowData {
    taskID: number;
    commitTime: string;
    status: '进行中' | '失败' | '已完成' | '等待中' | '已取消';
    msg?: string;
};

interface IData extends ITaskTableRowData {
    key: React.Key,
};

export interface IFlowOptimizationFlowTaskTableProps {
    data: ITaskTableRowData[] | undefined;
    onCancelTask: (id: number) => void;
};

const FlowOptimizationFlowTaskTable: React.FC<IFlowOptimizationFlowTaskTableProps> = ({ data, onCancelTask: handleCancelTask }) => {
    const { modal } = App.useApp();
    let dataSource = data?.map((val, ind) => { (val as IData).key = ind; return val as IData; });

    if (dataSource === undefined)
        dataSource = [];

    const columns: ColumnsType<IData> = [
        {
            title: '任务ID',
            dataIndex: 'taskID',
            key: 'taskID',
            align: 'center',
        },
        {
            title: '流程',
            key: 'flow',
            align: 'center',
            render: (_, record) => {
                return <a>查看流程</a>;
            },
        },
        {
            title: '提交时间',
            dataIndex: 'commitTime',
            key: 'commitTime',
            align: 'center',
        },
        {
            title: '当前状态',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
        },
        {
            title: '结果',
            key: 'result',
            align: 'center',
            render: (_, record) => {
                if (record.status === '失败')
                    return <a onClick={() => modal.error({ title: '失败信息', content: record.msg })}>失败信息</a>;
                else if (record.status === '已完成')
                    return <a>查看结果</a>;
            },
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => {
                if (record.status === '进行中' || record.status === '等待中')
                    return <Typography.Link onClick={() => handleCancelTask(record.taskID)}>取消</Typography.Link>;
            },
        }
    ];

    return (
        <Table 
            columns={columns} 
            dataSource={dataSource} />
    );
};

export default FlowOptimizationFlowTaskTable;