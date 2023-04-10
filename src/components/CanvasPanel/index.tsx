import { Graph, IG6GraphEvent, SnapLine } from "@antv/g6";
import React, { useEffect } from "react";
import "./CanvasPanel.module.less";
import { addNode, getType } from "./utils";
import { ModelClass } from "@/types";

export type CanvasSelectedType = 'node' | 'edge' | 'canvas';

export interface ICanvasPanelProps {
    onItemClick: (type: CanvasSelectedType, id?: string) => void;
    onItemCreate: (type: ModelClass, x: number, y: number) => string;
    graph: Graph | undefined;
    onGraphMount: (graph: Graph) => void;
};

const CanvasPanel: React.FC<ICanvasPanelProps> = ({ onItemClick: handleItemClick, onItemCreate, graph, onGraphMount: handleGraphMount }) => {
    const ref = React.useRef<HTMLDivElement>();

    const resizeCallback = () => {
        console.log('resize');
        if (graph && ref.current)
            graph.changeSize(ref.current.offsetWidth, ref.current.offsetHeight); // ref.current is set in useEffect
    };

    const initEvent = (graph: Graph) => {
        window.addEventListener("resize", resizeCallback, true);

        graph.on('canvas:drop', e => {
            if (e.originalEvent.type == "drop") {
                const dragEvent = e.originalEvent as DragEvent;
                const shape = dragEvent.dataTransfer?.getData('shape');
                if (shape) {
                    let id: string | undefined;
                    console.log(e);


                    if (shape === 'task-node')
                        id = onItemCreate('task-node', e.canvasX, e.canvasY);
                    else if (shape === 'state-node')
                        id = onItemCreate('state-node', e.canvasX, e.canvasY);

                    if (id)
                        if (shape === 'task-node')
                            addNode(graph, e.x, e.y, 'task-node', id);
                        else if (shape === 'state-node')
                            addNode(graph, e.x, e.y, 'state-node', id);
                }
            }
        });

        graph.on('nodeselectchange', e => {
            console.log(e);
            if (e.target && e.target._cfg['type'] === 'node') {
                if (e.select)
                    handleItemClick('node', e.target._cfg['id']);
                else
                    handleItemClick('canvas');
            }
            else if (e.target && e.target._cfg['type'] === 'edge')
                handleItemClick('edge', e.target._cfg['id']);
            else
                handleItemClick('canvas');
        });
    };

    useEffect(() => {
        if (!graph) {
            console.assert(ref.current, `ref.current is ${ref.current}!`)

            const snapLine = new SnapLine();

            graph = new Graph({
                container: ref.current!, // ref.current is set in useEffect
                renderer: "canvas",
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

            handleGraphMount(graph);
        }
        return () => window.removeEventListener("resize", resizeCallback);
    }, [])
    return <div id="graph-container" ref={ref} style={{ minWidth: '100%', minHeight: '100%', maxHeight: '100%', maxWidth: '100%', border: '1px solid #ddd' }}></div>;
};

export default CanvasPanel;