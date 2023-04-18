// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { ApiResponse } from '@/common/apis';
import type { NextApiRequest, NextApiResponse } from 'next';

import tasksOperation from '@/common/tasksApiData';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<''>>
) {
    if (req.method === 'DELETE') {
        const { taskId } = req.query;
        if (typeof taskId !== 'string' || isNaN(parseInt(taskId))) {
            res.status(400).json({ isOk: false, data: '', msg: 'query string error' });
            return;
        }

        const taskIdNum = parseInt(taskId);
        const task = tasksOperation.getById(taskIdNum);

        if (task === undefined) {
            res.status(200).json({ isOk: false, data: '', msg: `Cannot find task with taskId = ${taskId}` });
            return;
        }

        if (task.status !== '等待中' && task.status !== '进行中') {
            res.status(200).json({ isOk: false, data: '', msg: `Cannot cancel task in status ${task.status}` });
            return;
        }

        tasksOperation.updateTaskStatus(taskIdNum, '已取消');
        res.status(200).json({
            isOk: true,
            data: '',
            msg: '',
        });
    }
    else
        res.status(405).json({ isOk: false, data: '', msg: 'Method not allowed.' });
}
