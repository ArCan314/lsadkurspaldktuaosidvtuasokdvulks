import { ModelClass } from "@/types";
import { Graph, IG6GraphEvent } from "@antv/g6";

export function getType(shape: ModelClass) {
    if (shape === 'task-node')
        return 'rect';
    if (shape === 'state-node')
        return 'circle';
    return '';
}

export const addNode = (graph: Graph | undefined, x: number, y: number, shape: ModelClass, id: string, xBias?: number, yBias?: number) => {
    graph?.addItem('node', {
        x: x + (xBias ? xBias : 0),
        y: y + (yBias ? yBias : 0),
        anchorPoints: [[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]],
        id,
        label: id,
        size: shape === "state-node" ? 60 : [70, 50],
        type: getType(shape),
    });
};