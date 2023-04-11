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