import React, { useState } from 'react';
import { MenuProps } from 'antd';
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
import { toNumber } from './utils';

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

function removeNode(node: IDefaultModel): boolean {
    if (node.clazz !== 'state-node' && node.clazz !== 'task-node')
        return false;
    const arr = node.clazz === 'state-node' ? stateNodes : taskNodes;

    const ind = arr.findIndex(val => val.id === node.id);
    if (ind !== -1) {
        arr.splice(ind, 1);
        return true;
    }
    return false;
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
            // set('undo', true); // not implemented
            break;
        case 'undo':
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

const EditGraphView: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const [selectedModel, setSelectedModel] = useState<IDefaultModel>({});
    const [toolbarItemDisables, setToolBarItemDisables] = useState<ToolBarPanelProps['isIconDisabled']>(defaultToolBarDisables);
    const [graph, setGraph] = useState<Graph>();

    const handleItemClick = (type: CanvasSelectedType, id?: string) => {
        console.log('click item: ', type, id);
        if (type === 'node' && id !== undefined) {
            let item: IDefaultModel | undefined;
            if (id.startsWith('task-node'))
                item = taskNodes.find(v => v.id === id);
            else if (id.startsWith('state-node'))
                item = stateNodes.find(v => v.id === id);

            if (item)
                setSelectedModel(item);

            setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'node-select'));
        }
        else if (type === 'edge' && id !== undefined) {
            setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'edge-select'));
        }
        else {
            setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'canvas-select'));
            setSelectedModel({});
        }
    };

    const handleItemCreate = (type: ModelClass, x: number, y: number) => {
        if (type === 'task-node')
            return createTaskNode(x, y);
        if (type === 'state-node')
            return createStateNode(x, y);
        return "";
    };

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
                // TODO: handle error
                break;
            case 'paste':
                if (copyBuffer.clazz === 'state-node' || copyBuffer.clazz === 'task-node') {
                    const id = createNodeFrom(copyBuffer, 20, 20);
                    console.log(id);
                    if (id)
                        addNode(graph, copyBuffer.x!, copyBuffer.y!, copyBuffer.clazz, id, 20, 20);
                }
                // TODO: handle error
                break;
            case 'delete':
                if (selectedModel.clazz === 'state-node' || selectedModel.clazz === 'task-node') {
                    if (removeNode(selectedModel)) {
                        if (selectedModel.id !== undefined)
                            graph?.removeItem(selectedModel.id);
                        setSelectedModel({});
                        setToolBarItemDisables(updateItemDisables(toolbarItemDisables, 'item-delete'));
                    }
                }
                else if (selectedModel.clazz === 'state-task-arc' || selectedModel.clazz === 'task-state-arc') {
                    // TODO: implement delete edge
                }
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
                {
                    graph?.zoomTo(1);
                }
                break;
            case 'autoFit':
                {
                    graph?.fitView();
                }
                break;
            default:
                break;
        };

    };

    const handleGraphMount = (graphMounted: Graph) => {
        setGraph(graphMounted);
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
                console.error(`graph is undefined or copy.id === undefined ${{graph, copy}}`);
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
            // updateEdge(copy);
        }
        
        setSelectedModel(copy);
    };

    return (
        <Layout style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']} items={menuItems} />
            </Header>

            <ToolBarPanel onIconClick={handleToolBarIconClick} isIconDisabled={toolbarItemDisables} />
            <Layout hasSider={true}>
                <Sider width={150} style={{ background: colorBgContainer }}>
                    <ItemPanel />
                </Sider>
                <Content>
                    <CanvasPanel onItemCreate={handleItemCreate} onItemClick={handleItemClick} graph={graph} onGraphMount={handleGraphMount} />
                </Content>
                <Sider width={300}>
                    <DetailPanel model={selectedModel} units={[]} onChange={handleDetailChange} readonly={false} />
                </Sider>
            </Layout>
        </Layout>
    );
};

export default EditGraphView;