import { ModelClass } from "@/types";
import { Graph, IG6GraphEvent } from "@antv/g6";

export function getType(shape: ModelClass) {
    if (shape === 'task-node')
        return 'rect';
    if (shape === 'state-node')
        return 'circle';
    return '';
}

function getLabel(shape: ModelClass) {
    if (shape === 'task-node')
        return '任务节点';
    else if (shape === 'state-node')
        return '状态节点';
    return '';
}

export const addNode = (graph: Graph | undefined, x: number | undefined, y: number | undefined, shape: ModelClass, id: string, xBias?: number, yBias?: number) => {
    if (graph === undefined)
        return false;
    
    x = x ?? graph?.getGraphCenterPoint().x ?? 0;
    y = y ?? graph?.getGraphCenterPoint().y ?? 0;

    graph.addItem('node', {
        x: x + (xBias ? xBias : 0),
        y: y + (yBias ? yBias : 0),
        anchorPoints: [[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]],
        id,
        label: `${getLabel(shape)}-${id.split(':')[1]}`,
        size: shape === "state-node" ? 70 : [80, 50],
        type: getType(shape),
    });
    return true;
};

// 可能存在问题, 并且可能只能用于特定的 antv g6 版本
export const modifyItemId = (graph: Graph | undefined, originId: string, targetId: string): boolean => {
    if (graph === undefined)
        return false;

    const item = graph.findById(originId);
    if (!item)
        return false;

    const map = (graph as any).cfg.itemMap;
    if (map === undefined)
        return false;

    item.set('id', targetId);
    graph.updateItem(item, {
        id: targetId
    });

    map[targetId] = item;
    delete map[originId];
    return true;
};