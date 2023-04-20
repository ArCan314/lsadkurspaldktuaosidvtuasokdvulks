import Head from 'next/head'

import React, { useState } from 'react';
import {
    HomeOutlined,
} from '@ant-design/icons';
import { Col, Divider, MenuProps, Row, Space } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import UserHeader from '@/component/UserHeader';
import Image from 'next/image';
import tempImage from '@/../public/image.png';
import bitMap from '@/../public/Bitmap.png';
import { handleMainMenuClick, menuData } from '@/common/menuData';
import Link from 'next/link';

const { Header, Content, Footer, Sider } = Layout;

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
                    <Menu theme="dark" defaultSelectedKeys={['1a']} mode="inline" items={menuData} onClick={val => handleMainMenuClick(val.key)} />
                </Sider>
                <Layout className="site-layout">
                    <UserHeader />
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>
                                <Space><HomeOutlined />首页</Space>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                            <div><Typography.Title level={4} style={{ marginTop: 0 }}>价值链示意</Typography.Title></div>
                            <div style={{ textAlign: 'center' }} >
                                <Image alt='test' src={tempImage} width={369} height={357} />
                            </div>
                        </div>
                        <div style={{ height: 20 }}/>
                        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                            <div><Typography.Title level={4} style={{ marginTop: 0 }}>数据集信息</Typography.Title></div>
                            <Row gutter={[8, 8]}>
                                <Col span={8} style={{ padding: 10 }}>
                                    <div style={{ padding: 10, border: '1px solid #aaaaaa', borderRadius: 10, height: 150, backgroundColor: "#fdfdfd" }}>
                                        <div>
                                            <Space>
                                                <Image alt='test' src={bitMap} width={34} height={23} />
                                                <Typography.Title level={5} style={{ marginTop: 0 }}><Link href='/dataset'>Ciao</Link></Typography.Title>
                                            </Space>
                                        </div>
                                        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                                        <div style={{ paddingRight: 30 }}>
                                            <Typography.Text>作为一个 DVD类别数据集，收集用户购物后的点评评分，以及用户之间的社交联系，常用于各大推荐系统场景</Typography.Text>
                                        </div>
                                        <div style={{ paddingRight: 30, textAlign: 'right' }}>
                                            <Typography.Text type='secondary'>5 小时前</Typography.Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8} style={{ padding: 10 }}>
                                    <div style={{ padding: 10, border: '1px solid #aaaaaa', borderRadius: 10, height: 150, backgroundColor: "#fdfdfd" }}>
                                        <div>
                                            <Space>
                                                <Image alt='test' src={bitMap} width={34} height={23} />
                                                <Typography.Title level={5} style={{ marginTop: 0 }}><Link href='/dataset'>Epinions</Link></Typography.Title>
                                            </Space>
                                        </div>
                                        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                                        <div style={{ paddingRight: 30 }}>
                                            <Typography.Text>由用户的社交关系和他们对电影的评价结果组成，数据来源于用户在网站上对各种产品的主观评价</Typography.Text>
                                        </div>
                                        <div style={{ paddingRight: 30, textAlign: 'right' }}>
                                            <Typography.Text type='secondary'>10 小时前</Typography.Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8} style={{ padding: 10 }}>
                                    <div style={{ padding: 10, border: '1px solid #aaaaaa', borderRadius: 10, height: 150, backgroundColor: "#fdfdfd" }}>
                                        <div>
                                            <Space>
                                                <Image alt='test' src={bitMap} width={34} height={23} />
                                                <Typography.Title level={5} style={{ marginTop: 0 }}><Link href='/dataset'>DataCo</Link></Typography.Title>
                                            </Space>
                                        </div>
                                        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                                        <div style={{ paddingRight: 30 }}>
                                            <Typography.Text>用于大数据分析的 DataCo 智能供应链，重要注册活动领域：供应、生产、销售、商业分销</Typography.Text>
                                        </div>
                                        <div style={{ paddingRight: 30, textAlign: 'right' }}>
                                            <Typography.Text type='secondary'>2 天前</Typography.Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8} style={{ padding: 10 }}>
                                    <div style={{ padding: 10, border: '1px solid #aaaaaa', borderRadius: 10, height: 150, backgroundColor: "#fdfdfd" }}>
                                        <div>
                                            <Space>
                                                <Image alt='test' src={bitMap} width={34} height={23} />
                                                <Typography.Title level={5} style={{ marginTop: 0 }}><Link href='/dataset'>FB15k-237</Link></Typography.Title>
                                            </Space>
                                        </div>
                                        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                                        <div style={{ paddingRight: 30 }}>
                                            <Typography.Text>知识图谱Freebase的子集，15k表示其中知识库中有15k个主题词，237表示共有237种关系</Typography.Text>
                                        </div>
                                        <div style={{ paddingRight: 30, textAlign: 'right' }}>
                                            <Typography.Text type='secondary'>5 天前</Typography.Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8} style={{ padding: 10 }}>
                                    <div style={{ padding: 10, border: '1px solid #aaaaaa', borderRadius: 10, height: 150, backgroundColor: "#fdfdfd" }}>
                                        <div>
                                            <Space>
                                                <Image alt='test' src={bitMap} width={34} height={23} />
                                                <Typography.Title level={5} style={{ marginTop: 0 }}><Link href='/dataset'>wn18</Link></Typography.Title>
                                            </Space>
                                        </div>
                                        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                                        <div style={{ paddingRight: 30 }}>
                                            <Typography.Text>WordNet的子集，包含18种关系和40k种实体</Typography.Text>
                                        </div>
                                        <div style={{ paddingRight: 30, textAlign: 'right' }}>
                                            <Typography.Text type='secondary'>2 天前</Typography.Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8} style={{ padding: 10 }}>
                                    <div style={{ padding: 10, border: '1px solid #aaaaaa', borderRadius: 10, height: 150, backgroundColor: "#fdfdfd" }}>
                                        <div>
                                            <Space>
                                                <Image alt='test' src={bitMap} width={34} height={23} />
                                                <Typography.Title level={5} style={{ marginTop: 0 }}><Link href='/dataset'>wordNet</Link></Typography.Title>
                                            </Space>
                                        </div>
                                        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                                        <div style={{ paddingRight: 30 }}>
                                            <Typography.Text>该数据库将英语名词、动词、形容词和副词与同义词联系起来，这些同义词通过语义关系相互联系，从而确定单词的定义</Typography.Text>
                                        </div>
                                        <div style={{ paddingRight: 30, textAlign: 'right' }}>
                                            <Typography.Text type='secondary'>7 天前</Typography.Text>
                                        </div>
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
