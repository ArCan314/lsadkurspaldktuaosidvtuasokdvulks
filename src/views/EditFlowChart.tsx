import React, { useState } from 'react';
import { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';

import { ButtonText } from '@/common/types';

import ToolBarPanel from '@/components/ToolBarPanel';
import ItemPanel from '@/components/ItemPanel';
import CanvasPanel from '@/components/CanvasPanel/CanvasPanel';
import DetailPanel from '@/components/DetailPanel';

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const menuItems: MenuProps['items'] = ['流程编辑', '流程优化'].map((labelVal, key) => ({
    key: (key.toString()),
    label: labelVal,
}));

const EditGraphView: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const [isRightSideBarDisplay, setRightBarDisplay] = useState(false);
    const [selectedTool, setSelectedTool] = useState<ButtonText>('drag');

    return (
        <Layout style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']} items={menuItems} />
            </Header>

            <ToolBarPanel />
            <Layout hasSider={true}>
                <Sider style={{ background: colorBgContainer }}>
                    <ItemPanel />
                </Sider>
                <Content>
                    <CanvasPanel />
                </Content>
                <Sider>
                    <DetailPanel/>
                </Sider>
            </Layout>
        </Layout>
    );
};

export default EditGraphView;