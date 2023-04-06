import { ModelClass } from "@/types";

export function getType(shape: ModelClass) {
    if (shape === 'task-node')
        return 'rect';
    if (shape === 'state-node')
        return 'circle';
    return '';
}
