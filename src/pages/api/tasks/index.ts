// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { ApiResponse } from '@/common/apis';
import tasksOperation from '@/common/tasksApiData';
import type { ITaskTableRowData } from '@/components/FlowOptimizationTaskTable';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'

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
            tasksOperation.createTask(new Date().toLocaleString(), '等待中', req.body);
            res.status(200).json({ isOk: true, data: '', msg: '' });
        } catch (exception) {
            res.status(400).json({ isOk: false, data: '', msg: 'Request body is not valid.' });
        }
    }
    else
        res.status(405).json({ isOk: false, data: '', msg: 'Method not allowed.' });
}
