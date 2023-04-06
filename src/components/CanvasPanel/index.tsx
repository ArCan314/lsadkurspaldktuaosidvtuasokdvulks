import { Graph, IG6GraphEvent, SnapLine } from "@antv/g6";
import React, { useEffect } from "react";
import "./CanvasPanel.module.less";
import { getType } from "./utils";
import { ModelClass } from "@/types";

export type CanvasSelectedType = 'node' | 'edge' | 'canvas';

export interface ICanvasPanelProps {
    onItemClicked: (type: CanvasSelectedType, id?: string) => void;
    onItemCreate: (type: ModelClass) => string;
};

const CanvasPanel: React.FC<ICanvasPanelProps> = ({ onItemClicked, onItemCreate }) => {
    const ref = React.useRef<HTMLDivElement>();
    let graph: Graph | undefined;

    const resizeCallback = () => {
        console.log('resize');
        if (graph && ref.current)
            graph.changeSize(ref.current.offsetWidth, ref.current.offsetHeight); // ref.current is set in useEffect
    };

    const addNode = (e: IG6GraphEvent, shape: ModelClass, id: string) => {
        graph?.addItem('node', {
            x: e.canvasX,
            y: e.canvasY,
            anchorPoints: [[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]],
            id,
            label: id,
            size: shape === "state-node" ? 60 : [70, 50],
            type: getType(shape),
        });
    };

    const initEvent = (graph: Graph) => {
        window.addEventListener("resize", resizeCallback);

        graph.on('canvas:drop', e => {
            if (e.originalEvent.type == "drop") {
                const dragEvent = e.originalEvent as DragEvent;
                const shape = dragEvent.dataTransfer?.getData('shape');
                if (shape) {
                    let id: string | undefined;
                    if (shape === 'task-node')
                        id = onItemCreate('task-node');
                    else if (shape === 'state-node')
                        id = onItemCreate('state-node');

                    if (id)
                        if (shape === 'task-node')
                            graph.addItem('node', { x: e.canvasX, y: e.canvasY, anchorPoints: [[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]], id, label: id, size: [70, 50], type: getType(shape) });
                        else if (shape === 'state-node')
                            graph.addItem('node', { x: e.canvasX, y: e.canvasY, anchorPoints: [[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]], id, label: id, size: 60, type: getType(shape) });
                }
            }
        });

        graph.on('nodeselectchange', e => {
            console.log(e);
            if (e.target && e.target._cfg['type'] === 'node') {
                if (e.select)
                    onItemClicked('node', e.target._cfg['id']);
                else
                    onItemClicked('canvas');
            }
            else if (e.target && e.target._cfg['type'] === 'edge')
                onItemClicked('edge', e.target._cfg['id']);
            else
                onItemClicked('canvas');
        });

        graph.on('canvas:click', e => {
            onItemClicked('canvas');
        });
    };

    useEffect(() => {
        if (!graph) {
            console.assert(ref.current, `ref.current is ${ref.current}!`)

            const snapLine = new SnapLine();

            graph = new Graph({
                container: ref.current!, // ref.current is set in useEffect
                renderer: "svg",
                modes: {
                    default: ["zoom-canvas", "drag-node", "drag-canvas", {
                        type: 'click-select',
                        multiple: false,
                    }],
                },
                linkCenter: true,
                minZoom: 0.2,
                maxZoom: 5,
                plugins: [snapLine],
            });


            initEvent(graph);
            graph.render();
        }
        return () => window.removeEventListener("resize", resizeCallback);
    }, [])
    return <div id="graph-container" ref={ref} style={{ minWidth: '100%', minHeight: '100%', maxHeight: '100%', maxWidth: '100%', border: '1px solid #ddd' }}></div>;
};

export default CanvasPanel;