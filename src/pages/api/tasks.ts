// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ITableRowData } from '@/components/FlowOptimizationTaskTable';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'

const data: ITableRowData[] = [
    {
        taskID: '1',
        commitTime: '2023/04/12-10:00:00',
        status: '进行中',
    },
    {
        taskID: '2',
        commitTime: '2023/04/12-11:00:00',
        status: '失败',
        msg: '运行失败',
    },
    {
        taskID: '3',
        commitTime: '2023/04/12-12:00:00',
        status: '完成',
    },
    {
        taskID: '4',
        commitTime: '2023/04/12-13:00:00',
        status: '等待',
    },
];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ITableRowData[]>
) {
    const resData = _.clone(data);
    if (Math.random() > 0.5)
        resData.push({
            commitTime: "test",
            status: '等待',
            taskID: '5',
        });

    res.status(200).json(resData);
}
