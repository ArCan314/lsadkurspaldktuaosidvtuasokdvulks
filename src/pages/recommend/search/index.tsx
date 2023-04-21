import Head from 'next/head'

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import { Col, DatePicker, Divider, MenuProps, Radio, Row, Select, SelectProps, Space, Table, Tag } from 'antd';
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
    name: string;
    country: string;
    type: string;
    rank: number;
}

type Item = DataType;

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: '1',
            name: '潍柴动力',
            country: '中国',
            type: '国企',
            rank: 1,
        },
        {
            key: '2',
            name: '山推工程',
            country: '中国',
            type: '国企',
            rank: 2,
        },
        {
            key: '3',
            name: '沈阳机床',
            country: '中国',
            type: '国企',
            rank: 3,
        },
        {
            key: '4',
            name: '中国通用',
            country: '中国',
            type: '国企',
            rank: 4,
        },
    ]);

    const [count, setCount] = useState(4);

    const handleAdd = () => {
        const newData: DataType = {
            key: `${count}`,
            name: '企业名称',
            country: '中国',
            type: '国企',
            rank: Math.max(...dataSource.map(val => val.rank)) + 1,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '企业',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width: '25%',
            align: 'center',
        },
        {
            title: '国家',
            dataIndex: 'country',
            key: 'country',
            editable: true,
            width: '25%',
            align: 'center',
        },
        {
            title: '企业性质',
            dataIndex: 'type',
            key: 'type',
            editable: true,
            width: '25%',
            align: 'center',
        },
        {
            title: '推荐排位',
            dataIndex: 'rank',
            key: 'rank',
            editable: true,
            width: '25%',
            align: 'center',
        },
    ];

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const options: SelectProps['options'] = [
        { label: '西文排版', value: '1' },
        { label: '设计中的设计', value: '2' },
        { label: '版式设计原理', value: '3' },
        { label: '色彩设计的原理', value: '4' },
        { label: '一字一生', value: '5' },
        { label: '写给大家看的设计书', value: '6' },
        { label: '设计师的自我修养', value: '7' },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: DataType) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };

    return (
        <div>
            <Head>
                <title>活动管理</title>
            </Head>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                    <Menu theme="dark" defaultSelectedKeys={['1e']} mode="inline" items={menuData} onClick={val => handleMainMenuClick(val.key)} />
                </Sider>
                <Layout className="site-layout">
                    <UserHeader />
                    <div style={{ height: 16 }} />
                    <Content style={{ margin: '0 16px' }}>

                        <Menu selectedKeys={['2']} mode="horizontal" items={horizontalItems} onClick={val => val.key === '1' && router.push('/recommend')} />
                        <div style={{ padding: 24, display: 'flex', background: colorBgContainer }}>
                            <div style={{ width: '33%' }}>
                                <Space size='middle'>
                                    <span>伙伴搜索</span>
                                    <Input placeholder='输入伙伴名称' />
                                </Space>
                            </div>
                            <div style={{ width: '33%' }}>
                                <Space size='middle'>
                                    <span>状态</span>
                                    <Select
                                        style={{ width: 'max(50%, 200px)' }}
                                        allowClear
                                        placeholder='选择信息'
                                        options={options}
                                        // defaultValue={[]}
                                        maxTagCount='responsive'
                                    />
                                </Space>
                            </div>
                            <div style={{ width: '33%' }}>
                                <Space size='middle'>
                                    <span>日期</span>
                                    <DatePicker placeholder='请选择创建日期' />
                                </Space>
                            </div>
                        </div>
                        <div style={{ height: 20 }} />
                        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                            <div>
                                <Space size='large'>
                                    <Radio.Group>
                                        <Radio.Button value="copy">复制</Radio.Button>
                                        <Radio.Button value="hide">隐藏</Radio.Button>
                                        <Radio.Button value="move">移动</Radio.Button>\
                                        <Radio.Button value="delete">删除</Radio.Button>
                                    </Radio.Group>
                                    {/* <Button disabled>复制</Button>
                                    <Button disabled>隐藏</Button>
                                    <Button disabled>移动</Button>
                                    <Button disabled>删除</Button> */}
                                    <span><Space><RedoOutlined />刷新</Space></span>
                                </Space>
                            </div>
                            <div style={{ height: 20 }} />
                            <Table
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection
                                }}
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                dataSource={dataSource}
                                columns={columns as any} />
                            <Button type='primary' onClick={handleAdd} style={{ marginTop: -10 }}>添加伙伴</Button>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </div>
    )
}
