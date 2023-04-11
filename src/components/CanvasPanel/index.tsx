import { EdgeConfig, Graph, IEdge, IG6GraphEvent, Item, SnapLine } from "@antv/g6";
import React, { useEffect } from "react";
import "./CanvasPanel.module.css";
import { addNode, modifyItemId } from "./utils";
import { ModelClass } from "@/types";
import { message } from "antd";
import _ from "lodash";

export type CanvasSelectedType = 'node' | 'edge' | 'canvas';

export interface ICanvasPanelProps {
    onItemClick: (type: CanvasSelectedType, id?: string) => void;
    onNodeCreate: (type: ModelClass, x: number, y: number) => string;

    graph: Graph | undefined;
    onGraphMount: (graph: Graph) => void;

    hasEdge: (fromId: string, toId: string) => boolean;
    onEdgeCreate: (fromId: string, toId: string) => [string, ModelClass]; // return edge-id and edge-type
};

let createEdgeBeginNodeId: string = '';
let createEdgeEndNodeId: string = '';

const CanvasPanel: React.FC<ICanvasPanelProps> = ({
    onItemClick: handleItemClick,
    onNodeCreate: handleNodeCreate,
    graph,
    onGraphMount: handleGraphMount,
    onEdgeCreate: handleEdgeCreate,
    hasEdge }) => {

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
                    // console.log(e);

                    if (shape === 'task-node')
                        id = handleNodeCreate('task-node', e.canvasX, e.canvasY);
                    else if (shape === 'state-node')
                        id = handleNodeCreate('state-node', e.canvasX, e.canvasY);

                    if (id)
                        if (shape === 'task-node')
                            addNode(graph, e.x, e.y, 'task-node', id);
                        else if (shape === 'state-node')
                            addNode(graph, e.x, e.y, 'state-node', id);
                }
            }
        });

        graph.on('nodeselectchange', e => {
            // console.log(e);
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
            // console.log('start mount graph');
            console.assert(ref.current, `ref.current is ${ref.current}!`)

            const snapLine = new SnapLine();

            graph = new Graph({
                container: ref.current!, // ref.current is set in useEffect
                renderer: "canvas",
                modes: {
                    default: ["zoom-canvas", "drag-node", "drag-canvas",
                        {
                            type: 'click-select',
                            selectEdge: true,
                            multiple: false,
                        },
                        {
                            type: 'create-edge',
                            trigger: 'click',
                            key: 'shift',
                            shouldBegin: e => {
                                if (e.item) {
                                    createEdgeBeginNodeId = e.item.get('id');
                                    return true;
                                }
                                return false;
                            },
                            shouldEnd: e => {
                                if (e.item) {
                                    createEdgeEndNodeId = e.item.get('id');
                                    if (createEdgeBeginNodeId == createEdgeEndNodeId) {
                                        message.info('不允许创建自环边');
                                        return false;
                                    }

                                    if (hasEdge(createEdgeBeginNodeId, createEdgeEndNodeId)) {
                                        message.info('不允许创建多重边');
                                        return false;
                                    }

                                    const isBeginNodeTaskNode = createEdgeBeginNodeId.startsWith('task-node');
                                    const isEndNodeTaskNode = createEdgeEndNodeId.startsWith('task-node');
                                    if ((isBeginNodeTaskNode && isEndNodeTaskNode) || (!isBeginNodeTaskNode && !isEndNodeTaskNode)) {
                                        message.info('创建边时只能从状态到任务或者从任务到状态');
                                        return false;
                                    }
                                    return true;
                                }
                                return false;
                            },
                        }],
                },
                defaultEdge: {
                    style: {
                        stroke: '#F6BD16',
                        lineWidth: 2,
                    },
                },
                linkCenter: true,
                minZoom: 0.2,
                maxZoom: 5,
                plugins: [snapLine],
            });

            graph.on('aftercreateedge', (e: IG6GraphEvent) => {
                if (graph === undefined)
                    return;

                if ('edge' in e) {
                    // console.log(_.cloneDeep(e.edge));
                    const edge = e.edge as IEdge;

                    const originId = edge.get('id');
                    const [id, clazz] = handleEdgeCreate(createEdgeBeginNodeId, createEdgeEndNodeId);
                    if (edge._cfg)
                        edge._cfg.id = id;

                    modifyItemId(graph, originId, id); // TODO: handle error

                    graph.updateItem(edge, { clazz, label: id });
                }

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