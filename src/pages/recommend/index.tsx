import Head from 'next/head'

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import { Col, DatePicker, Divider, MenuProps, Radio, Row, Select, SelectProps, Space, Table, Tag, message } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import UserHeader from '@/component/UserHeader';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { handleMainMenuClick, menuData } from '@/common/menuData';
import router from 'next/router';

const { Header, Content, Footer, Sider } = Layout;
const { Column, ColumnGroup } = Table;
type MenuItem = Required<MenuProps>['items'][number];

const EditableContext = React.createContext<FormInstance<any> | null>(null);

const horizontalItems: MenuProps['items'] = [
    {
        label: '供应伙伴推荐',
        key: '1',
    },
    {
        label: '供应伙伴搜索',
        key: '2',
    },
];

interface DataType {
    key: React.Key;
    no: number;
    dataset: string;
    modelParameter: string;
    doneDate: string;
    RMSE: number;
    MSE: number;
}

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: '1',
            no: 1,
            dataset: 'DataGo',
            modelParameter: 'GraphChain',
            doneDate: '2022-12-02',
            RMSE: 1.0329,
            MSE: 0.7928
        },
    ]);

    const columns = [
        {
            title: '编号',
            dataIndex: 'no',
            key: 'no',
            align: 'center',
        },
        {
            title: '数据集',
            dataIndex: 'dataset',
            key: 'dataset',
            align: 'center',
        },
        {
            title: '模型参数',
            dataIndex: 'modelParameter',
            key: 'modelParameter',
            align: 'center',
        },
        {
            title: '完成时间',
            dataIndex: 'doneDate',
            key: 'doneDate',
            align: 'center',
        },
        {
            title: 'RMSE',
            dataIndex: 'RMSE',
            key: 'RMSE',
            align: 'center',
        },
        {
            title: 'MSE',
            dataIndex: 'MSE',
            key: 'MSE',
            align: 'center',
        },
    ];

    const datasetOptions: SelectProps['options'] = [
        { label: 'Ciao', value: '1' },
        { label: 'Epinions', value: '2' },
        { label: 'DataGo', value: '3' },
        { label: 'FB125k-237', value: '4' },
        { label: 'wn18', value: '5' },
        { label: 'wordNet', value: '6' },
    ];

    const modelParameterOptions: SelectProps['options'] = [
        { label: 'GCN', value: '1' },
        { label: 'GAT', value: '2' },
        { label: 'GraphSAGE', value: '3' },
        { label: 'GraphChain', value: '4' },
        { label: 'GraphRec', value: '5' },
        { label: 'PMF', value: '6' },
        { label: 'TrustMF', value: '7' },
    ];

    return (
        <div>
            <Head>
                <title>活动管理</title>
            </Head>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                    <Menu theme="dark" defaultSelectedKeys={['1e']} mode="inline" items={menuData} onClick={val => handleMainMenuClick(val.key)}/>
                </Sider>
                <Layout className="site-layout">
                    <UserHeader />
                    <div style={{ height: 16 }}/>
                    <Content style={{ margin: '0 16px' }}>
                        <Menu selectedKeys={['1']} mode="horizontal" items={horizontalItems} onClick={val => val.key === '2' && router.push('/recommend/search')}/>
                        <div style={{ padding: 24, display: 'flex', background: colorBgContainer }}>
                            <div style={{ width: '33%' }}>
                                <Space size='middle'>
                                    <span>模型参数</span>
                                    <Select
                                        style={{ width: 'max(50%, 200px)' }}
                                        allowClear
                                        placeholder='选择参数'
                                        options={modelParameterOptions}
                                    />
                                </Space>
                            </div>
                            <div style={{ width: '30%' }}>
                                <Space size='middle'>
                                               <span>数据集</span>
                                    <Select
                                        style={{ width: 'max(50%, 200px)' }}
                                        allowClear
                                        placeholder='选择数据集'
                                        options={datasetOptions}
                                    />
                                </Space>
                            </div>
                        </div>
                        <div style={{ height: 20 }} />
                        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                            <Table
                                bordered
                                dataSource={dataSource}
                                columns={columns} />
                            <div style={{ textAlign: 'center' }}>
                                <Space size={60}>
                                    <Button>取消</Button>
                                    <Button onClick={() => message.info('模型计算中，请耐心等待')} style={{ background: 'rgba(103, 194, 58, 1)', color: 'white', fontWeight: 'bold' }}>开启推荐</Button>
                                </Space>
                            </div>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </div>
    )
}
