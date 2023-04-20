import Head from 'next/head'

import React, { useState } from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import { Col,  MenuProps, Row, Table } from 'antd';
import {  Layout, Menu, theme, Typography } from 'antd';
import UserHeader from '@/component/UserHeader';

import './index.module.css';
import { handleMainMenuClick, menuData } from '@/common/menuData';

const { Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

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
    const [selecetedIndex, setSelectedIndex] = useState(0);

    return (
        <div>
            <Head>
                <title>颜色自定义</title>
            </Head>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                    <Menu theme="dark" defaultSelectedKeys={['1c']} mode="inline" items={menuData} onClick={val => handleMainMenuClick(val.key)}/>
                </Sider>
                <Layout className="site-layout">
                    <UserHeader />
                    <Content style={{ margin: '0 16px' }}>
                        <div style={{ margin: '16px 0' }}>
                        </div>
                        <div style={{ padding: 24, background: colorBgContainer }}>
                            <div><Typography.Title level={4} style={{ marginTop: 0 }}>点击选择背景色</Typography.Title></div>
                            <Row gutter={[16, 16]}>
                                <Col span={6}><div><div className='bg-selector' onClick={() => setSelectedIndex(0)} style={{ height: 90, cursor: 'pointer', border: selecetedIndex == 0 ? '2px solid blue' : undefined, borderRadius: 4, background: 'linear-gradient(135deg, rgba(238, 242, 243, 1) 0%, rgba(142, 158, 171, 1) 100%)' }}></div></div></Col>
                                <Col span={6}><div><div className='bg-selector' onClick={() => setSelectedIndex(1)} style={{ height: 90, cursor: 'pointer', border: selecetedIndex == 1 ? '2px solid blue' : undefined, borderRadius: 4, background: 'linear-gradient(90deg, rgba(194, 233, 251, 1) 0%, rgba(161, 196, 253, 1) 100%)' }}></div></div></Col>
                                <Col span={6}><div><div className='bg-selector' onClick={() => setSelectedIndex(2)} style={{ height: 90, cursor: 'pointer', border: selecetedIndex == 2 ? '2px solid blue' : undefined, borderRadius: 4, background: 'linear-gradient(90deg, rgba(212, 252, 121, 1) 0%, rgba(150, 230, 161, 1) 100%)' }}></div></div></Col>
                                <Col span={6}><div><div className='bg-selector' onClick={() => setSelectedIndex(3)} style={{ height: 90, cursor: 'pointer', border: selecetedIndex == 3 ? '2px solid blue' : undefined, borderRadius: 4, background: 'linear-gradient(135deg, rgba(252, 198, 135, 1) 0%, rgba(242, 134, 160, 1) 100%)' }}></div></div></Col>
                                <Col span={6}><div><div className='bg-selector' onClick={() => setSelectedIndex(4)} style={{ height: 90, cursor: 'pointer', border: selecetedIndex == 4 ? '2px solid blue' : undefined, borderRadius: 4, background: 'linear-gradient(90deg, rgba(143, 243, 121, 1) 0%, rgba(28, 189, 180, 1) 100%)' }}></div></div></Col>
                                <Col span={6}><div><div className='bg-selector' onClick={() => setSelectedIndex(5)} style={{ height: 90, cursor: 'pointer', border: selecetedIndex == 5 ? '2px solid blue' : undefined, borderRadius: 4, background: 'linear-gradient(90deg, rgba(251, 194, 235, 1) 0%, rgba(161, 140, 209, 1) 100%)' }}></div></div></Col>
                                <Col span={6}><div><div className='bg-selector' onClick={() => setSelectedIndex(6)} style={{ height: 90, cursor: 'pointer', border: selecetedIndex == 6 ? '2px solid blue' : undefined, borderRadius: 4, background: 'linear-gradient(90deg, rgba(187, 155, 241, 1) 0%, rgba(136, 123, 242, 1) 100%)' }}></div></div></Col>
                                <Col span={6}><div><div className='bg-selector' onClick={() => setSelectedIndex(7)} style={{ height: 90, cursor: 'pointer', border: selecetedIndex == 7 ? '2px solid blue' : undefined, borderRadius: 4, background: 'linear-gradient(90deg, rgba(127, 254, 216, 1) 0%, rgba(9, 189, 254, 1) 100%)' }}></div></div></Col>
                            </Row>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </div>
    )
}
