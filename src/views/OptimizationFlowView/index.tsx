import React, { useEffect, useState } from 'react';
import { App, Button, Divider, MenuProps, message } from 'antd';
import { Layout, Menu, theme } from 'antd';
import _ from 'lodash';
import Router from 'next/router';
import "./OptimizationFlowView.module.less";
import FlowOptimizationFlowTaskTable, { ITableRowData } from '@/components/FlowOptimizationTaskTable';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Header, Content } = Layout;

const menuItems: MenuProps['items'] = ['流程编辑', '流程优化'].map((labelVal, key) => ({
    key: (key.toString()),
    label: labelVal,
}));

const handleMenuClick = (ind: number) => {
    if (ind == 0) {
        Router.push('/');
    }
};

const EditGraphView: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const [tableData, setTableData] = useState<ITableRowData[]>();

    const handleRefresh = (showMessage?: boolean) => {
        axios.get<ITableRowData[]>('/api/tasks')
            .then((val) => setTableData(val.data))
            .then(() => showMessage && message.success('刷新成功'))
            .catch((e) => console.error(e));
    };

    useEffect(() => {
        handleRefresh();
    }, []);

    return (
        <App>
            <Layout style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
                <Header className="header">
                    <div className="logo" />
                    <Menu onClick={e => handleMenuClick(parseInt(e.key))} theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
                </Header>

                <Content style={{ padding: '25px 50px', display: 'flex' }}>
                    <div style={{ padding: 24, minHeight: '100%', minWidth: '100%', background: colorBgContainer } as React.CSSProperties}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ marginRight: 'auto' }}>流程优化任务表</div>
                            <Button style={{ margin: '0 20px' }}><PlusOutlined />添加任务</Button>
                            <Button style={{ margin: '0 20px' }} onClick={() => handleRefresh(true)}><RedoOutlined />刷   新</Button>
                        </div>

                        <Divider style={{ margin: '10px 0 0 0' }} />
                        <FlowOptimizationFlowTaskTable data={tableData} />
                    </div>

                </Content>
            </Layout>
        </App>
    );
};

export default EditGraphView;