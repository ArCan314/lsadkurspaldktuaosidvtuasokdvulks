// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { ApiResponse } from '@/common/apis';
import type { IExportFormat } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

import _ from 'lodash';
import tasksOperation from '@/common/tasksApiData';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<string | ''>>
) {
    if (req.method === 'GET') {
        const { taskId } = req.query;
        if (typeof taskId !== 'string' || isNaN(parseInt(taskId))) {
            res.status(400).json({ isOk: false, data: '', msg: 'query string error' });
            return;
        }
        const taskIdNum = parseInt(taskId);
        const resData = tasksOperation.getById(taskIdNum);
        if (resData === undefined) {
            res.status(200).json({ isOk: false, data: '', msg: `Cannot find task with taskId = ${taskId}` });
            return;
        }

        res.status(200).json({
            isOk: true,
            data: resData.content,
            msg: '',
        });
    }
    else
        res.status(405).json({ isOk: false, data: '', msg: 'Method not allowed.' });
}
