// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { ApiResponse } from '@/common/apis';
import type { ITaskTableRowData } from '@/components/FlowOptimizationTaskTable';
import type { NextApiRequest, NextApiResponse } from 'next';

import tasksOperation from '@/common/tasksApiData';
import _ from 'lodash';

function processRunning(id: number) {
    setTimeout(() => {
        const obj = tasksOperation.getById(id);
        if (obj) {
            if (obj.status === '进行中') {
                tasksOperation.updateTaskStatus(id, '已完成');
            }
        }
    }, 5000);
}

function processWaiting(id: number) {
    setTimeout(() => {
        const obj = tasksOperation.getById(id);
        if (obj) {
            if (obj.status === '等待中') {
                tasksOperation.updateTaskStatus(id, '进行中');
                processRunning(id);
            }
        }
    }, 5000);
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<ITaskTableRowData[] | ''>>
) {
    if (req.method === 'GET') {
        const resData = _.clone(tasksOperation.getAll());
        res.status(200).json({
            isOk: true,
            data: resData,
            msg: '',
        });
    }
    else if (req.method === 'POST') {
        try {
            // const obj: IExportFormat = JSON.parse(req.body());
            const id = tasksOperation.createTask(new Date().toLocaleString(), '等待中', req.body);
            processWaiting(id);
            res.status(200).json({ isOk: true, data: '', msg: '' });
        } catch (exception) {
            res.status(400).json({ isOk: false, data: '', msg: 'Request body is not valid.' });
        }
    }
    else
        res.status(405).json({ isOk: false, data: '', msg: 'Method not allowed.' });
}
