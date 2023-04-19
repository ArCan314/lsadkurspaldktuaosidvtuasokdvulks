// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { ApiResponse } from '@/common/apis';
import type { NextApiRequest, NextApiResponse } from 'next';

import tasksOperation from '@/common/tasksApiData';
import type { OptimizationResult } from '@/types';

const sampleData: OptimizationResult[] = [
    [[["Still", "Separation"], [[5, 2, 50.0], [8, 2, 113.75]]], [["Reactor_2", "Reaction_3"], [[4, 1, 50.0], [5, 1, 47.5], [6, 1, 50.0], [7, 1, 16.25]]], [["Reactor_2", "Reaction_2"], [[2, 2, 50.0], [8, 2, 50.0]]], [["Reactor_1", "Reaction_2"], [[2, 2, 80.0], [4, 2, 80.0], [8, 2, 80.0]]], [["Reactor_1", "Reaction_1"], [[0, 2, 76.0], [6, 2, 78.0]]], [["Reactor_2", "Reaction_1"], [[0, 2, 50.0]]], [["Heater", "Heating"], [[0, 1, 84.0], [5, 1, 52.0]]], [["Reactor_1", "Reaction_3"], []]],
    [[["\u719f\u6599\u78e8", "\u719f\u6599\u78e8\u5236"], [[6, 1, 100.0], [8, 1, 100.0], [10, 1, 100.0], [13, 1, 100.0], [15, 1, 100.0], [17, 1, 100.0], [19, 1, 100.0], [21, 1, 100.0], [23, 1, 100.0]]], [["\u7145\u70e7\u7089A", "\u7145\u70e7"], [[4, 4, 100.0], [9, 4, 100.0], [13, 4, 100.0], [17, 4, 100.0]]], [["\u7145\u70e7\u7089B", "\u7145\u70e7"], [[2, 4, 100.0], [6, 4, 100.0], [11, 4, 100.0], [15, 4, 100.0], [19, 4, 100.0]]], [["\u751f\u6599\u78e8", "\u751f\u6599\u78e8\u5236"], [[0, 2, 100.0], [2, 2, 100.0], [4, 2, 100.0], [7, 2, 100.0], [9, 2, 100.0], [11, 2, 100.0], [13, 2, 100.0], [15, 2, 100.0], [17, 2, 100.0]]]]];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<OptimizationResult | ''>>
) {
    if (req.method === 'GET') {
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

        if (task.status !== '已完成') {
            res.status(200).json({ isOk: false, data: '', msg: `Cannot get result from tasks in status ${task.status}` });
            return;
        }

        res.status(200).json({
            isOk: true,
            data: sampleData[taskIdNum % sampleData.length],
            msg: '',
        });
    }
    else
        res.status(405).json({ isOk: false, data: '', msg: 'Method not allowed.' });
}
