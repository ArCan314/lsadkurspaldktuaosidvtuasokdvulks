import Head from 'next/head'

import React, { useState } from 'react';
import {
    DesktopOutlined,
    HomeOutlined,
    PieChartOutlined,

} from '@ant-design/icons';
import { Col, Divider, MenuProps, Row, Space, Table, Tag } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import UserHeader from '@/component/UserHeader';
import Image from 'next/image';
import datasetImage from '../../../public/价值链数据集展示.png@3x.png';
import { handleMainMenuClick, menuData } from '@/common/menuData';
import Link from 'next/link';

const { Header, Content, Footer, Sider } = Layout;
const { Column, ColumnGroup } = Table;

interface DataType {
    key: React.Key;
    name: string;
    arthor: string;
    describe: string;
    createDate: string;
}

const data: DataType[] = [
    {
        key: '1',
        name: '测试数据集B',
        arthor: 'qsy',
        describe: '本数据集优先用于展示效果',
        createDate: '2022-12-01',
    },
    {
        key: '2',
        name: '测试数据集C',
        arthor: 'abc',
        describe: '本数据集优先用于展示效果',
        createDate: '2023-02-01',
    },
    {
        key: '3',
        name: '测试数据集A',
        arthor: 'test',
        describe: '本数据集优先用于展示效果',
        createDate: '2022-12-03',
    },
];

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <div>
            <Head>
                <title>分析页</title>
            </Head>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                    <Menu theme="dark" defaultSelectedKeys={['1a']} mode="inline" items={menuData} onClick={val => handleMainMenuClick(val.key)}/>
                </Sider>
                <Layout className="site-layout">
                    <UserHeader />
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>
                                <Space><HomeOutlined /><Link href='/'>首页</Link></Space>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                数据集详情
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: colorBgContainer }}>
                            <div><Typography.Title level={4} style={{ marginTop: 0 }}>数据集详情</Typography.Title></div>
                            <div style={{ textAlign: 'center' }} >
                                <Image alt='test' src={datasetImage} style={{ width: '100%', height: 'auto' }} height={320} />
                            </div>
                        </div>
                        <div style={{ height: 20 }} />
                        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                            <div><Typography.Title level={4} style={{ marginTop: 0 }}>数据集详细信息</Typography.Title></div>
                            <Table dataSource={data}>
                                <Column align='center' title="数据集名称" dataIndex="name" key="name" />
                                <Column align='center' title="数据集创建人" dataIndex="arthor" key="arthor" />
                                <Column align='center' title="描述" dataIndex="describe" key="describe" />
                                <Column align='center' title="创建日期" dataIndex="createDate" key="createDate" />
                            </Table>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </div>
    )
}
