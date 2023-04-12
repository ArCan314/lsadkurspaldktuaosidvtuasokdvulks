import React from 'react';
import { Table, App } from 'antd';
import _ from 'lodash';
import type { ColumnsType } from 'antd/es/table';


export interface ITableRowData {
    taskID: string;
    commitTime: string;
    status: string;
    msg?: string;
};

interface IData extends ITableRowData {
    key: React.Key,
};

export interface IFlowOptimizationFlowTaskTableProps {
    data: ITableRowData[] | undefined;
};

const FlowOptimizationFlowTaskTable: React.FC<IFlowOptimizationFlowTaskTableProps> = ({ data }) => {
    const { modal } = App.useApp();

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
                else if (record.status === '完成')
                    return <a>查看结果</a>;
            },
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => {
                if (record.status === '进行中' || record.status === '等待')
                    return <a>取消</a>;
            },
        }
    ];

    return (
        <Table 
            columns={columns} 
            dataSource={data?.map((val, ind) => { val.key = ind; return val; })} />
    );
};

export default FlowOptimizationFlowTaskTable;