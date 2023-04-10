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


const taskNodes: ITaskNodeModel[] = [];
let taskNodeCount = 0;
const stateNodes: IStateNodeModel[] = [];
let stateNodeCount = 0;


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
        id: `task-node: ${taskNodeCount++}`,
        active: true,
        clazz: 'task-node',
        label: '任务节点',
        x,
        y,
    };
    taskNodes.push(data);
    return data.id as string;
};

function createStateNode(x: number, y: number) {
    const data: ITaskNodeModel = {
        id: `state-node: ${stateNodeCount++}`,
        active: true,
        clazz: 'state-node',
        label: '状态节点',
        x,
        y,
    };
    stateNodes.push(data);
    return data.id as string;
};


const EditGraphView: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const [selectedModel, setSelectedModel] = useState<IDefaultModel>({});
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

        }
        else if (type === 'edge' && id !== undefined) {
        }
        else {
        }
    };

    const handleItemCreate = (type: ModelClass, x: number, y: number) => {
        if (type === 'task-node')
            return createTaskNode(x, y);
        if (type === 'state-node')
            return createStateNode(x, y);
        return "";
    };


    const handleGraphMount = (graphMounted: Graph) => {
        setGraph(graphMounted);
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