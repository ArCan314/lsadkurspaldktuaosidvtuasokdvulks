import React from 'react';
import { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import _ from 'lodash';
import Router from 'next/router';

export type ToolBarItemDisableAction = 'node-select' | 'edge-select' | 'item-delete' | 'redo' | 'undo' | 'canvas-select' | 'copy';

const { Header, Content, Sider } = Layout;

const menuItems: MenuProps['items'] = ['流程编辑', '流程优化'].map((labelVal, key) => ({
    key: (key.toString()),
    label: labelVal,
}));

const EditGraphView: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const handleMenuClick = (ind: number) => {
        if (ind == 0) {
            Router.push('/');
        }
    };

    return (
        <>
            <Layout style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
                <Header className="header">
                    <div className="logo" />
                    <Menu onClick={e => handleMenuClick(parseInt(e.key))} theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
                </Header>

                <Layout hasSider={true}>
                    TEST
                </Layout>
            </Layout>
        </>

    );
};

export default EditGraphView;