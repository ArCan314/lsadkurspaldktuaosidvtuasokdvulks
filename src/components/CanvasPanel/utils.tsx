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

export const addNode = (graph: Graph | undefined, x: number, y: number, shape: ModelClass, id: string, xBias?: number, yBias?: number) => {
    graph?.addItem('node', {
        x: x + (xBias ? xBias : 0),
        y: y + (yBias ? yBias : 0),
        anchorPoints: [[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]],
        id,
        label: `${getLabel(shape)}-${id.split(':')[1]}`,
        size: shape === "state-node" ? 70 : [80, 50],
        type: getType(shape),
    });
};