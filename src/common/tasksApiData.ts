import type { ITaskTableRowData } from "@/components/FlowOptimizationTaskTable";
import fs from 'fs';

const tasks: (ITaskTableRowData & {content: string})[] = require('../../data/tasks.json');
// export const taskData: (ITaskTableRowData & {content: string})[] = [
//     // {
//     //     taskID: 1,
//     //     commitTime: '2023/04/12-10:00:00',
//     //     status: '进行中',
//     // },
//     // {
//     //     taskID: 2,
//     //     commitTime: '2023/04/12-11:00:00',
//     //     status: '失败',
//     //     msg: '运行失败',
//     // },
//     // {
//     //     taskID: 3,
//     //     commitTime: '2023/04/12-12:00:00',
//     //     status: '完成',
//     // },
//     // {
//     //     taskID: 4,
//     //     commitTime: '2023/04/12-13:00:00',
//     //     status: '等待',
//     // },
// ];

const tasksOperation = {
    getAll: () => tasks,
    getById: (id: number) => tasks.find(val => val.taskID === id),
    createTask,
    updateTaskStatus,
};

function createTask(commitTime: string, status: ITaskTableRowData['status'], content: string) {
    const nextId = tasks.length ? Math.max(...tasks.map(val => val.taskID)) + 1 : 0;
    tasks.push({
        taskID: nextId,
        commitTime,
        content,
        status
    });
    saveData();
    return nextId;
};

function updateTaskStatus(id: number, status: ITaskTableRowData['status']) {
    const task = tasks.find(val => val.taskID === id);
    if (task === undefined)
        return false;
    
    task.status = status;
    saveData();
}

function saveData() {
    fs.writeFileSync('data/tasks.json', JSON.stringify(tasks));
}

export default tasksOperation;





