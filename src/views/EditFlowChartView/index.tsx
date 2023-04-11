import React, { useState } from 'react';
import { MenuProps, message } from 'antd';
import { Layout, Menu, theme } from 'antd';
import ToolBarPanel, { ToolBarPanelProps } from '@/components/ToolBarPanel';
import ItemPanel from '@/components/ItemPanel';
import CanvasPanel, { CanvasSelectedType } from '@/components/CanvasPanel';
import DetailPanel from '@/components/DetailPanel';
import { DetailKey, IDefaultModel, IStateNodeModel, IStateTaskArcModel, ITaskNodeModel, ITaskStateArcModel, ModelClass } from '@/types';
import { defaultToolBarDisables } from './data';
import { ToolBarIconType } from '@/components/ToolBarPanel/data';
import { Graph } from '@antv/g6';
import { addNode } from '@/components/CanvasPanel/utils';
import _ from 'lodash';
import { generateArcId, isStateNode, isTaskNode, toNumber, validateImportedJSON } from './utils';
import ImportModal from '@/components/Modals/ImportModal';
import Router from 'next/router';

export type ToolBarItemDisableAction = 'node-select' | 'edge-select' | 'item-delete' | 'redo' | 'undo' | 'canvas-select' | 'copy';

const { Header, Content, Sider } = Layout;

const menuItems: MenuProps['items'] = ['流程编辑', '流程优化'].map((labelVal, key) => ({
    key: (key.toString()),
    label: labelVal,
}));

const ZOOM_STEP = 0.2;

const taskNodes: ITaskNodeModel[] = [];
let taskNodeCount = 0;
const stateNodes: IStateNodeModel[] = [];
let stateNodeCount = 0;

function updateNode(node: IDefaultModel) {
    if (node.clazz !== 'state-node' && node.clazz !== 'task-node')
        return;

    const arr = node.clazz === 'state-node' ? stateNodes : taskNodes;
    const ind = arr.findIndex(val => val.id === node.id);
    if (ind !== -1)
        arr[ind] = _.clone(node);
}

function findNodeById(id: string) {
    return taskNodes.find(val => val.id === id) ?? stateNodes.find(val => val.id === id);
}

function createNodeFrom(node: IDefaultModel, xBias?: number, yBias?: number) {
    if (node.clazz !== 'state-node' && node.clazz !== 'task-node')
        return;

    const copy = _.clone(node);
    copy.id = `${copy.clazz}: ${node.clazz === 'state-node' ? stateNodeCount++ : taskNodeCount++}`;

    if (copy.x !== undefined && xBias !== undefined)
        copy.x += xBias;

    if (copy.y !== undefined && yBias !== undefined)
        copy.y += yBias;

    if (node.clazz === 'state-node')
        stateNodes.push(copy);
    else
        taskNodes.push(copy);
    return copy.id;
};

function createTaskNode(x: number, y: number) {
    const data: ITaskNodeModel = {
        id: `task-node: ${taskNodeCount}`,
        active: true,
        clazz: 'task-node',
        label: `任务节点-${taskNodeCount}`,
        x,
        y,
    };
    taskNodeCount++;
    taskNodes.push(data);
    return data.id as string;
};

function createStateNode(x: number, y: number) {
    const data: ITaskNodeModel = {
        id: `state-node: ${stateNodeCount}`,
        active: true,
        clazz: 'state-node',
        label: `状态节点-${stateNodeCount}`,
        x,
        y,
    };
    stateNodeCount++;
    stateNodes.push(data);
    return data.id as string;
};

function removeNode(node: IDefaultModel, graph: Graph | undefined): boolean {
    if (node.clazz !== 'state-node' && node.clazz !== 'task-node')
        return false;
    const arr = node.clazz === 'state-node' ? stateNodes : taskNodes;

    const ind = arr.findIndex(val => val.id === node.id);
    if (ind !== -1) {
        arr.splice(ind, 1);
        if (node.id)
            graph?.removeItem(node.id);

        removeConnectedEdge(node, graph);
        return true;
    }
    return false;
}

const tsArcs: ITaskStateArcModel[] = [];
const stArcs: IStateTaskArcModel[] = [];

function updateEdge(edge: IDefaultModel) {
    if (edge.clazz !== 'state-task-arc' && edge.clazz !== 'task-state-arc')
        return;

    const arr = edge.clazz === 'state-task-arc' ? stArcs : tsArcs;
    const ind = arr.findIndex(val => val.id === edge.id);
    if (ind !== -1)
        arr[ind] = _.clone(edge);
}

function hasEdge(fromId: string, toId: string): boolean {
    return !!tsArcs.find(val => val.fromId === fromId && val.toId === toId) ||
        !!stArcs.find(val => val.fromId === fromId && val.toId === toId);
}

function findEdge(fromId: string, toId: string) {
    return findEdgeById(generateArcId(fromId, toId));
}

function findEdgeById(id: string) {
    return tsArcs.find(val => val.id === id) ?? stArcs.find(val => val.id === id);
}

function removeEdge(edge: IDefaultModel, graph: Graph | undefined): boolean {
    if (edge.clazz !== 'state-task-arc' && edge.clazz !== 'task-state-arc')
        return false;

    const arr = edge.clazz === 'state-task-arc' ? stArcs : tsArcs;
    const ind = arr.findIndex(val => val.id === edge.id);
    if (ind !== -1) {
        arr.splice(ind, 1);
        if (edge.id)
            graph?.removeItem(edge.id);

        return true;
    }
    return false;
}

// Used by removeNode
function removeConnectedEdge(node: IDefaultModel, graph: Graph | undefined): boolean {
    if (node.id === undefined)
        return false;

    const removeEdge = (arr: IDefaultModel[], id: string) => {
        const toRemoveInds = [];
        for (let i = 0; i < arr.length; i++)
            if (arr[i].id !== undefined && arr[i].id?.includes(id))
                toRemoveInds.push(i);

        for (let i = toRemoveInds.length - 1; i >= 0; i--) {
            const arc = arr[i];
            arr.splice(i, 1);
            if (arc.id !== undefined)
                graph?.removeItem(arc.id);
        }
    };

    removeEdge(tsArcs, node.id);
    removeEdge(stArcs, node.id);
    return true;
}

function createArc(fromId: string, toId: string): string {
    const isFromTaskNode = isTaskNode(fromId), isToTaskNode = isTaskNode(toId);
    if ((isFromTaskNode && isToTaskNode) || (!isFromTaskNode && !isToTaskNode))
        return '';

    let arr = isFromTaskNode ? tsArcs : stArcs;
    const clazz: ModelClass = isFromTaskNode ? 'task-state-arc' : 'state-task-arc';

    arr.push({
        id: generateArcId(fromId, toId),
        active: true,
        label: '',
        clazz,
        fromId: fromId,
        toId: toId,
    });

    if (clazz === 'state-task-arc') {
        const arc = arr[arr.length - 1];
        arc.rho = 0;
    }
    else { // clazz === 'task-state-arc'
        const arc = arr[arr.length - 1];
        arc.rho = 0;
        (arc as ITaskStateArcModel).duration = 0;
    }
    return arr[arr.length - 1].id!;
}

function updateGraphLabel(graph: Graph, id: string, label: string): boolean {
    const item = graph.findById(id);
    if (item.getType() !== 'node' && item.getType() !== 'edge')
        return false;

    const model = item.getModel();
    graph.updateItem(item, {
        label,
    });
    return true;
};

function generateExportJSON(graph: Graph | undefined): string {
    if (graph === undefined)
        return '';

    const obj = {
        taskNodes,
        stateNodes,
        tsArcs,
        stArcs,
        taskNodeCount,
        stateNodeCount,
        graphData: graph.save(),
    };
    // console.log(obj);
    const exportStr = JSON.stringify(obj);
    return exportStr;
};

function exportJSON(graph: Graph | undefined): boolean {
    if (graph === undefined)
        return false;


    const exportStr = generateExportJSON(graph);
    navigator.clipboard.writeText(exportStr)
        .then(() => message.info('已导出至剪切板'));

    return true;
};

function importJSON(graph: Graph | undefined, content: string): boolean {
    // not implemented
    if (graph === undefined)
        return false;
    let obj;
    try {
        obj = JSON.parse(content);
    } catch (objError) {
        console.error(objError);
        return false;
    }

    if (!validateImportedJSON(obj))
        return false;

    taskNodes.splice(0, taskNodes.length);
    taskNodes.push(...obj.taskNodes);

    stateNodes.splice(0, stateNodes.length);
    stateNodes.push(...obj.stateNodes);

    stArcs.splice(0, stArcs.length);
    stArcs.push(...obj.stArcs);

    tsArcs.splice(0, tsArcs.length);
    tsArcs.push(...obj.tsArcs);

    taskNodeCount = obj.taskNodeCount;
    stateNodeCount = obj.stateNodeCount;

    graph.changeData(obj.graphData);
    // console.log({ taskNodes, stateNodes, stArcs, tsArcs, data: graph.save() });
    return true;
}

function updateItemDisables(origin: ToolBarPanelProps['isIconDisabled'], action: ToolBarItemDisableAction) {
    const copy = [...origin];
    const set = (key: ToolBarIconType, val: boolean) => {
        const ind = copy.findIndex(val => val[0] == key);
        if (ind !== -1)
            copy[ind][1] = val;
    };

    switch (action) {
        case 'edge-select':
            set('copy', false); // multi-edge is not allowed
            set('delete', true);
            break;
        case 'node-select':
            set('copy', true);
            set('delete', true);
            break;
        case 'item-delete':
            // set('undo', true); // not implemented
            set('copy', false);
            set('delete', false);
            break;
        case 'redo':
            console.error('redo method is not implemented');
            // set('undo', true); // not implemented
            break;
        case 'undo':
            console.error('undo method is not implemented');
            // set('redo', true); // not implemented
            break;
        case 'copy':
            set('paste', true);
            break;
        case 'canvas-select':
            set('copy', false);
            set('delete', false);
            break;
        default:
            console.warn(`unhandled action ${action} in ${module.filename}:${updateItemDisables}`);
            break;
    }
    return copy;
}

let copyBuffer: IDefaultModel = {};

let graph: Graph | undefined;

Router.events.on('routeChangeStart', (...args) => {
    if (args[0] === '/optimization') {
        // console.log('out: /');
        localStorage.setItem('graph', generateExportJSON(graph));
    }
});

Router.events.on('routeChangeComplete', (...args) => {
    if (args[0] === '/') {
        // console.log('in: /');
        const graphData = localStorage.getItem('graph');
        if (graphData !== null)
            importJSON(graph, graphData);
    }
});

const EditGraphView: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const [selectedModel, setSelectedModel] = useState<IDefaultModel>({});
    const [toolbarItemDisables, setToolBarItemDisables] = useState<ToolBarPanelProps['isIconDisabled']>(defaultToolBarDisables);
    const [isImportModalDisplay, setIsImportModalDisplay] = useState<boolean>(false);
    const [graphState, setGraphState] = useState<Graph>();

    const handleMenuClick = (ind: number) => {
        if (ind == 1)
            Router.push('/optimization');
    };

    const handleItemClick = (type: CanvasSelectedType, id?: string) => {
        // console.log('click item: ', type, id);
        if (type === 'node' && id !== undefined) {
            const node = findNodeById(id);
            if (node)
                setSelectedModel(node);

            setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'node-select'));
        }
        else if (type === 'edge' && id !== undefined) {
            const edge = findEdgeById(id);
            if (edge)
                setSelectedModel(edge);
            setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'edge-select'));
        }
        else {
            setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'canvas-select'));
            setSelectedModel({});
        }
    };

    const handleNodeCreate = (type: ModelClass, x: number, y: number) => {
        if (type === 'task-node')
            return createTaskNode(x, y);
        if (type === 'state-node')
            return createStateNode(x, y);
        return "";
    };

    const handleExport = () => {
        return exportJSON(graph);
    }

    const handleImport = () => {
        setIsImportModalDisplay(true);
    }

    const handleToolBarIconClick = (type: ToolBarIconType) => {
        switch (type) {
            case 'undo':
                console.warn('undo is not implemented.')
                break;
            case 'redo':
                console.warn('redo is not implemented')
                break;
            case 'copy':
                if (selectedModel.clazz === 'state-node' || selectedModel.clazz === 'task-node') {
                    copyBuffer = _.clone(selectedModel);
                    setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'copy'));
                }
                else
                    console.warn('unsupported operation copy for item ', _.cloneDeep(selectedModel));
                // TODO: handle error
                break;
            case 'paste':
                if (copyBuffer.clazz === 'state-node' || copyBuffer.clazz === 'task-node') {
                    const id = createNodeFrom(copyBuffer, 20, 20);
                    console.log(id);
                    if (id)
                        addNode(graph, copyBuffer.x!, copyBuffer.y!, copyBuffer.clazz, id, 20, 20);
                }
                else
                    console.warn('unsupported operation paste for item ', _.cloneDeep(selectedModel));
                // TODO: handle error
                break;
            case 'delete':
                if (selectedModel.clazz === 'state-node' || selectedModel.clazz === 'task-node') {
                    if (removeNode(selectedModel, graph)) {
                        setSelectedModel({});
                        setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'item-delete'));
                    }
                }
                else if (selectedModel.clazz === 'state-task-arc' || selectedModel.clazz === 'task-state-arc') {
                    if (removeEdge(selectedModel, graph)) {
                        setSelectedModel({});
                        setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'item-delete'));
                    }
                }
                else
                    console.warn('unsupported operation copy for item ', _.cloneDeep(selectedModel));
                // TODO: handle error
                break;
            case 'zoomIn':
                {
                    if (graph === undefined)
                        break;
                    const curZoom = graph.getZoom();

                    // if (selectedModel.id !== undefined) {
                    //     const item = graph.findById(selectedModel.id);
                    //     const x = item.getBBox().centerX !== undefined ? item.getBBox().centerX! : item.getBBox().x + item.getBBox().width / 2;
                    //     const y = item.getBBox().centerY !== undefined ? item.getBBox().centerY! : item.getBBox().y + item.getBBox().height / 2;
                    //     const point = graph.getPointByCanvas(x, y);
                    //     console.log(point);
                    //     graph.zoomTo(curZoom + ZOOM_STEP);
                    // }
                    // else {
                    const width = graph.getWidth();
                    const height = graph.getHeight();
                    const point = graph.getPointByCanvas(width / 2, height / 2);

                    graph.zoomTo(curZoom + ZOOM_STEP, point);
                    // }
                }
                break;
            case 'zoomOut':
                {
                    if (graph === undefined)
                        break;
                    const curZoom = graph.getZoom();

                    // if (selectedModel.id !== undefined) {
                    //     const item = graph.findById(selectedModel.id);
                    //     const x = item.getBBox().centerX !== undefined ? item.getBBox().centerX! : item.getBBox().x + item.getBBox().width / 2;
                    //     const y = item.getBBox().centerY !== undefined ? item.getBBox().centerY! : item.getBBox().y + item.getBBox().height / 2;
                    //     const point = graph.get(x, y);
                    //     console.log(point);
                    //     graph.zoomTo(curZoom - ZOOM_STEP, point);
                    // }
                    // else {
                    const width = graph.getWidth();
                    const height = graph.getHeight();
                    const point = graph.getPointByCanvas(width / 2, height / 2);

                    graph.zoomTo(curZoom - ZOOM_STEP, point);
                    // }
                }
                break;
            case 'resetZoom':
                graph?.zoomTo(1);
                break;
            case 'autoFit':
                graph?.fitView();
                break;
            case 'import':
                handleImport();
                break;
            case 'export':
                handleExport(); // TODO: handle error
                break;
            default:
                console.warn('unhandled tool bar icon click: ', { type });
                break;
        };

    };

    const handleGraphMount = (graphMounted: Graph) => {
        graph = graphMounted;
        setGraphState(graphMounted);
        // console.log('graph mounted');
    };

    const handleDetailChange = (key: DetailKey, val: any) => {
        const copy = _.clone(selectedModel);

        if (key === 'capacity' && copy.clazz === 'state-node' && (typeof val === 'number' || typeof val === 'string'))
            (copy as IStateNodeModel).capacity = toNumber(val);
        else if (key === 'duration' && copy.clazz === 'task-state-arc' && (typeof val === 'number' || typeof val === 'string'))
            (copy as ITaskStateArcModel).duration = toNumber(val);
        else if (key === 'hideIcon' && typeof val === 'boolean')
            copy.hideIcon = val;
        else if (key === 'initial' && copy.clazz === 'state-node' && (typeof val === 'number' || typeof val === 'string'))
            (copy as IStateNodeModel).initial = toNumber(val);
        else if (key === 'label' && typeof val === 'string') {
            if (graph && copy.id !== undefined)
                updateGraphLabel(graph, copy.id, val); // TODO: handle error
            else
                console.error(`graph is undefined or copy.id === undefined ${{ graph, copy }}`);
            copy.label = val;
        }
        else if (key === 'name' && typeof val === 'string')
            copy.name = val;
        else if (key === 'price' && copy.clazz === 'state-node' && (typeof val === 'number' || typeof val === 'string'))
            (copy as IStateNodeModel).price = toNumber(val);
        else if (key === 'rho' && (copy.clazz === 'state-task-arc' || copy.clazz === 'task-state-arc') && (typeof val === 'number' || typeof val === 'string'))
            (copy as IStateTaskArcModel).rho = toNumber(val);
        else if (key === 'unitId' && copy.clazz === 'task-node' && (typeof val === 'number' || typeof val === 'string'))
            (copy as ITaskNodeModel).unitId = toNumber(val);
        else
            console.warn('unhandled detail change type: ', { key, val }, typeof val, copy);

        if (copy.clazz === 'state-node' || copy.clazz === 'task-node')
            updateNode(copy);
        else if (copy.clazz === 'state-task-arc' || copy.clazz === 'task-state-arc') {
            updateEdge(copy);
        }

        setSelectedModel(copy);
    };

    const handleEdgeCreate = (fromId: string, toId: string): [string, ModelClass] => {
        if (isTaskNode(fromId) && isStateNode(toId))
            return [createArc(fromId, toId), 'task-state-arc'];
        else if (isStateNode(fromId) && isTaskNode(toId))
            return [createArc(fromId, toId), 'state-task-arc'];
        else
            console.log('unhandled edge create ', fromId, toId);
        return ['', 'state-task-arc'];
    }

    return (
        <>
            <ImportModal
                isDisplay={isImportModalDisplay}
                onCancel={() => setIsImportModalDisplay(false)}
                onOk={(content) => { importJSON(graph, content) || message.error('导入失败'); setIsImportModalDisplay(false); }}
            />

            <Layout style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
                <Header className="header">
                    <div className="logo" />
                    <Menu onClick={e => handleMenuClick(parseInt(e.key))} theme="dark" mode="horizontal" defaultSelectedKeys={['0']} items={menuItems} />
                </Header>

                <ToolBarPanel onIconClick={handleToolBarIconClick} isIconDisabled={toolbarItemDisables} />
                <Layout hasSider={true}>
                    <Sider width={150} style={{ background: colorBgContainer }}>
                        <ItemPanel />
                    </Sider>
                    <Content>
                        <CanvasPanel
                            onNodeCreate={handleNodeCreate}
                            onItemClick={handleItemClick}
                            hasEdge={hasEdge}
                            graph={graphState}
                            onGraphMount={handleGraphMount}
                            onEdgeCreate={handleEdgeCreate}
                        />
                    </Content>
                    <Sider width={300}>
                        <DetailPanel model={selectedModel} units={[]} onChange={handleDetailChange} readonly={false} />
                    </Sider>
                </Layout>
            </Layout>
        </>

    );
};

export default EditGraphView;