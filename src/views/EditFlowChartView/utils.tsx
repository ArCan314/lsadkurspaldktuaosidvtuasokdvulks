import { ModelClass } from "@/types";

export const toNumber = (num: number | string): number => {
    if (typeof num === 'string')
        return parseInt(num);
    return num;
};


export const isTaskNode = (id: string): boolean => id.startsWith('task-node');
export const isStateNode = (id: string): boolean => id.startsWith('state-node');

export const generateArcId = (fromId: string, toId: string) => {
    if (isTaskNode(fromId) && isStateNode(toId))
        return `ts-arc:{ from: ${fromId}, to: ${toId}}`;
    else if (isStateNode(fromId) && isTaskNode(toId))
        return `st-arc:{ from: ${fromId}, to: ${toId}}`;
    return '';
}

export const isSTArc = (id: string): boolean => id.startsWith('st-arc');
export const isTSArc = (id: string): boolean => id.startsWith('ts-arc');

export const isId = (id: string): boolean => isTaskNode(id) || isStateNode(id) || isSTArc(id) || isTSArc(id);

export const validateImportedJSON = (obj: unknown): boolean => {
    if (typeof obj !== 'object')
        return false;

    if (obj === null)
        return false;

    // TODO: validate units

    if (Object.keys(obj).length !== 9 || 
        !('taskNodes' in obj) || !('stateNodes' in obj) ||
        !('tsArcs' in obj) || !('stArcs' in obj) || 
        !('graphData' in obj) || !('taskNodeCount' in obj) || 
        !('stateNodeCount' in obj) || !('unitCount' in obj) ||
        !('units' in obj))
        return false;

    // TODO: validate inside object
    // let { taskNodes, stateNodes, tsArcs, stArcs } = obj;

    // const validateArr = (arr: unknown, clazz: ModelClass): boolean => {
    //     if (!Array.isArray(arr))
    //         return false;

    //     if (!arr.every(val => typeof val === 'object'))
    //         return false;

    //     if (!arr.every(val => 'id' in val &&
    //         typeof val.id === 'string' &&
    //         isId(val.id) &&
    //         val.id.split(':')[0] === clazz))
    //         return false;

    //     if (!arr.every(val => 'clazz' in val &&
    //         typeof val.clazz === 'string' &&
    //         val.clazz === clazz))
    //         return false;

    //     if (clazz === 'state-node') {
    //         if (!arr.every(val => {
    //             if ('capacity' in val && typeof val.capacity !== 'number')
    //                 return false;
    //             return true;
    //         }))
    //             return false;

    //         if (!arr.every(val => {
    //             if ('initial' in val && typeof val.initial !== 'number')
    //                 return false;
    //             return true;
    //         }))
    //             return false;

    //         if (!arr.every(val => {
    //             if ('price' in val && typeof val.price !== 'number')
    //                 return false;
    //             return true;
    //         }))
    //             return false;
    //     }
    //     else if (clazz === 'state-task-arc') {
    //         if (!arr.every(val => {
    //             if ('rho' in val && typeof val.rho !== 'number')
    //                 return false;
    //             return true;
    //         }))
    //             return false;

    //         if (!arr.every(val => {
    //             if ('fromId' in val && typeof val.fromId !== 'string')
    //                 return false;
    //             return true;
    //         }))
    //             return false;

    //         if (!arr.every(val => {
    //             if ('toId' in val && typeof val.toId !== 'string')
    //                 return false;
    //             return true;
    //         }))
    //             return false;
    //     }
    //     else if (clazz === 'task-node') {
    //         if (!arr.every(val => {
    //             if ('unitId' in val && typeof val.unitId !== 'number')
    //                 return false;
    //             return true;
    //         }))
    //             return false;
    //     }
    //     else if (clazz === 'task-state-arc') {
    //         if (!arr.every(val => {
    //             if ('rho' in val && typeof val.rho !== 'number')
    //                 return false;
    //             return true;
    //         }))
    //             return false;

    //         if (!arr.every(val => {
    //             if ('duration' in val && typeof val.duration !== 'number')
    //                 return false;
    //             return true;
    //         }))
    //             return false;

    //         if (!arr.every(val => {
    //             if ('fromId' in val && typeof val.fromId !== 'string')
    //                 return false;
    //             return true;
    //         }))
    //             return false;

    //         if (!arr.every(val => {
    //             if ('toId' in val && typeof val.toId !== 'string')
    //                 return false;
    //             return true;
    //         }))
    //             return false;
    //     }
    //     else if (clazz === 'units') {
    //         // TODO: handle units
    //     }

    //     return true;
    // };

    // if (!validateArr(taskNodes, 'task-node') || !validateArr(stateNodes, 'state-node') ||
    //     !validateArr(stArcs, 'state-task-arc') || !validateArr(tsArcs, 'task-state-arc'))
    //     return false;

    return true;
}