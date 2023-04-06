import React, { useState } from 'react';
import { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import ToolBarPanel from '@/components/ToolBarPanel';
import ItemPanel from '@/components/ItemPanel';
import CanvasPanel, { CanvasSelectedType } from '@/components/CanvasPanel';
import DetailPanel from '@/components/DetailPanel';
import { IDefaultModel, IStateNodeModel, ITaskNodeModel, ModelClass } from '@/types';

const { Header, Content, Sider } = Layout;

const menuItems: MenuProps['items'] = ['流程编辑', '流程优化'].map((labelVal, key) => ({
    key: (key.toString()),
    label: labelVal,
}));

const taskNodes: ITaskNodeModel[] = [];
let taskNodeCount = 0;
const stateNodes: IStateNodeModel[] = [];
let stateNodeCount = 0;

const createTaskNode = () => {
    const data: ITaskNodeModel = {
        id: `task-node: ${taskNodeCount++}`,
        active: true,
        clazz: 'task-node',
        label: '任务节点',
    };
    taskNodes.push(data);
    return data.id as string;
};

const createStateNode = () => {
    const data: ITaskNodeModel = {
        id: `state-node: ${stateNodeCount++}`,
        active: true,
        clazz: 'state-node',
        label: '状态节点',
    };
    stateNodes.push(data);
    return data.id as string;
};

const createItem = (type: ModelClass) => {
    if (type === 'task-node')
        return createTaskNode();
    if (type === 'state-node')
        return createStateNode();
    return "";
};

const EditGraphView: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const [selectedModel, setSelectedModel] = useState<IDefaultModel>({});

    const clickItem = (type: CanvasSelectedType, id?: string) => {
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
            setSelectedModel({});
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']} items={menuItems} />
            </Header>

            <ToolBarPanel />
            <Layout hasSider={true}>
                <Sider width={150} style={{ background: colorBgContainer }}>
                    <ItemPanel />
                </Sider>
                <Content>
                    <CanvasPanel onItemCreate={createItem} onItemClicked={clickItem} />
                </Content>
                <Sider width={300}>
                    <DetailPanel model={selectedModel} units={[]} onChange={(a, b) => console.log(a, b)} readonly={false} />
                </Sider>
            </Layout>
        </Layout>
    );
};

export default EditGraphView;