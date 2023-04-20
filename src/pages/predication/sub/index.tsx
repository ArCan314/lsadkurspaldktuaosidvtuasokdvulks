import Head from 'next/head'

import React, { useState } from 'react';

import { Col, MenuProps, Row, SelectProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import UserHeader from '@/component/UserHeader';
import { handleMainMenuClick, menuData } from '@/common/menuData';

import beforeImage from "../../../../public/before.png";
import afterImage from "../../../../public/after.png";
import Image from 'next/image';
import router from 'next/router';

const { Content, Footer, Sider } = Layout;

const horizontalItems: MenuProps['items'] = [
    {
        label: '预测缺失链接',
        key: '1',
    },
    {
        label: '缺失链接补齐',
        key: '2',
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
                <title>链接预测</title>
            </Head>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                    <Menu theme="dark" defaultSelectedKeys={['1f']} mode="inline" items={menuData} onClick={val => handleMainMenuClick(val.key)}/>
                </Sider>
                <Layout className="site-layout">
                    <UserHeader />
                    <div style={{ height: 16 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Menu selectedKeys={['2']} mode="horizontal" items={horizontalItems} onClick={val => val.key === '1' && router.push('/predication')}/>

                        <div style={{ padding: 24, background: colorBgContainer }}>
                            <Row gutter={[8, 8]}>
                                <Col span={12}>
                                    <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold' }}>
                                        旧链接价值链
                                    </div>
                                    {/* <div style={{ height: 10 }}/> */}
                                    <div style={{ textAlign: 'center' }}>
                                        <Image src={beforeImage} alt='旧链接价值链图片' style={{ width: '100%', height: 'auto' }} />
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold' }}>
                                        新链接价值链
                                    </div>
                                    <div style={{ height: 10 }}/>
                                    <div style={{ textAlign: 'center' }}>
                                        <Image src={afterImage} alt='新链接价值链图片' style={{ width: '100%', height: 'auto' }} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </div>
    )
}
