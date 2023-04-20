import Head from 'next/head'

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Divider, MenuProps, Row, Space, Table, Tag } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import UserHeader from '@/component/UserHeader';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm } from 'antd';
import type { FormInstance } from 'antd/es/form';
import './human-resource.module.css';
import { handleMainMenuClick, menuData } from '@/common/menuData';

const { Header, Content, Footer, Sider } = Layout;
const { Column, ColumnGroup } = Table;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface DataType {
    key: React.Key;
    name: string;
    country: string;
    city: string;
    birthday: string;
    phone: string;
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
            name: '刘先生',
            country: '中国',
            city: '北京',
            birthday: '1999-01-02',
            phone: '123-4567-8901',
        },
        {
            key: '2',
            name: '马先生',
            country: '英国',
            city: '伦敦',
            birthday: '1998-02-03',
            phone: '12345-678901',
        },
        {
            key: '3',
            name: '王先生',
            country: '中国',
            city: '上海',
            birthday: '1997-03-12',
            phone: '133-4567-8901',
        },
        {
            key: '4',
            name: '冯先生',
            country: '中国',
            city: '广州',
            birthday: '1999-09-29',
            phone: '143-4567-8901',
        },
    ]);

    // const [count, setCount] = useState(2);

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width: '15%',
            align: 'center',
        },
        {
            title: '国家',
            dataIndex: 'country',
            key: 'country',
            editable: true,
            width: '15%',
            align: 'center',
        },
        {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
            editable: true,
            width: '15%',
            align: 'center',
        },
        {
            title: '出生日期',
            dataIndex: 'birthday',
            key: 'birthday',
            editable: true,
            width: '25%',
            align: 'center',
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
            editable: true,
            width: '30%',
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

    return (
        <div>
            <Head>
                <title>分析页</title>
            </Head>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                    <Menu theme="dark" defaultSelectedKeys={['1b']} mode="inline" items={menuData} onClick={val => handleMainMenuClick(val.key)}/>
                </Sider>
                <Layout className="site-layout">
                    <UserHeader />
                    <div style={{ height: 16 }}/>
                    <Content style={{ margin: '0 16px' }}>
                        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                            <div><Typography.Title level={4} style={{ marginTop: 0 }}>人员管理</Typography.Title></div>
                            <Table
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                dataSource={dataSource}
                                columns={columns as ColumnTypes} />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </div>
    )
}
