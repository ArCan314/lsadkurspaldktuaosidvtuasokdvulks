import React, { useEffect, useState } from 'react';
import { App, Button, Divider, MenuProps, message } from 'antd';
import { Layout, Menu, theme } from 'antd';
import _ from 'lodash';
import Router from 'next/router';
import "./OptimizationFlowView.module.less";
import FlowOptimizationFlowTaskTable, { ITaskTableRowData } from '@/components/FlowOptimizationTaskTable';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import Apis from '@/common/apis';
import AddTaskModal from '@/components/Modals/AddTaskModal';

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
    const [tableData, setTableData] = useState<ITaskTableRowData[]>();
    const [isAddTaskModalDisplay, setIsAddTaskModalDisplay] = useState<boolean>(false);

    useEffect(() => {
        handleRefresh();
    }, []);

    const handleRefresh = (showMessage?: boolean) => {
        Apis.getTasks()
            .then(response => response.data)
            .then(val => {
                if (val.isOk) {
                    setTableData(val.data);
                    showMessage && message.success('刷新成功');
                }
                else
                    message.error(val.msg);
            })
            .catch((e) => console.error(e));
    };

    const handleAddTask = (content: string) => {
        Apis.addTask(content)
            .then(response => response.data)
            .then(data => {
                if (data.isOk) {
                    message.info('添加任务成功');
                    handleRefresh();
                    setIsAddTaskModalDisplay(false);
                }
                else {
                    message.error(data.msg);
                }
            })
            .catch(e => console.error(e));
    };

    const handleCancelTask = (taskId: number) => {
        Apis.cancelTask(taskId)
            .then(response => response.data)
            .then(data => {
                if (data.isOk) {
                    message.info('取消任务成功');
                    handleRefresh();
                    setIsAddTaskModalDisplay(false);
                }
                else
                    message.error(data.msg);
            })
            .catch(e => console.error(e));
    };

    return (
        <App>
            <AddTaskModal
                onCancel={() => setIsAddTaskModalDisplay(false)}
                isDisplay={isAddTaskModalDisplay}
                onOk={handleAddTask}
            />

            <Layout style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
                <Header className="header">
                    <div className="logo" />
                    <Menu onClick={e => handleMenuClick(parseInt(e.key))} theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
                </Header>

                <Content style={{ padding: '25px 50px', display: 'flex' }}>
                    <div style={{ padding: 24, minHeight: '100%', minWidth: '100%', background: colorBgContainer } as React.CSSProperties}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ marginRight: 'auto' }}>流程优化任务表</div>
                            <Button style={{ margin: '0 20px' }} onClick={() => setIsAddTaskModalDisplay(true)}><PlusOutlined />添加任务</Button>
                            <Button style={{ margin: '0 20px' }} onClick={() => handleRefresh(true)}><RedoOutlined />刷   新</Button>
                        </div>

                        <Divider style={{ margin: '10px 0 0 0' }} />
                        <FlowOptimizationFlowTaskTable 
                            data={tableData}
                            onCancelTask={handleCancelTask}/>
                    </div>

                </Content>
            </Layout>
        </App>
    );
};

export default EditGraphView;