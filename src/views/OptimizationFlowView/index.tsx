import React, { useEffect, useState } from 'react';
import { App, Breadcrumb, Button, Divider, MenuProps, Typography, message } from 'antd';
import { Layout, Menu, theme } from 'antd';
import _ from 'lodash';
import Router from 'next/router';
import "./OptimizationFlowView.module.less";
import FlowOptimizationFlowTaskTable, { ITaskTableRowData } from '@/components/FlowOptimizationTaskTable';
import { HomeOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import Apis from '@/common/apis';
import AddTaskModal from '@/components/Modals/AddTaskModal';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import type { IExportFormat } from '@/types';
import { Graph, SnapLine } from '@antv/g6';

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

let graph: Graph | undefined;
let content: string = "";

const renderFlow = (content: string) => {
    try {
        const obj: IExportFormat = JSON.parse(content);
        const container = document.getElementById('graph-container');
        if (!graph || !container)
            return;

        graph.changeSize(container.offsetWidth, container.offsetHeight);
        graph.changeData(obj.graphData, false);
        graph.fitView();
    } catch (exception) {
        console.error(exception);
    }
};

const resizeCallback = () => {
    const container = document.getElementById('graph-container');
    if (graph && container)
        graph.changeSize(container.offsetWidth, container.offsetHeight);
}

const mountGraph = () => {
    const container = document.getElementById('graph-container');
    if (container) {
        const snapLine = new SnapLine();
        graph = new Graph({
            container: container,
            renderer: 'canvas',
            modes: {
                default: ["zoom-canvas", "drag-node", "drag-canvas"],
            },
            minZoom: 0.2,
            maxZoom: 5,
            plugins: [snapLine],
        });

        window.addEventListener("resize", resizeCallback, true);
        graph.render();

        return true;
    }
    return false;
};

const EditGraphView: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const [tableData, setTableData] = useState<ITaskTableRowData[]>();
    const [isAddTaskModalDisplay, setIsAddTaskModalDisplay] = useState<boolean>(false);
    const [breadcrumbItems, setBreadcrumbItems] = useState<ItemType[]>([{ title: <HomeOutlined /> }, { title: '流程优化任务表' }])

    useEffect(() => {
        handleRefresh();
        if (!graph && mountGraph()) {
            return () => {
                window.removeEventListener("resize", resizeCallback);
                graph?.destroy();
                graph = undefined;
            };
        }
    }, []);

    useEffect(() => {
        if (breadcrumbItems.length === 3) {
            renderFlow(content);
        }
        else if (breadcrumbItems.length === 2) {
            graph?.clear();
        }
    }, [breadcrumbItems]);

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
                else
                    message.error(data.msg);
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

    const handleBack = () => {
        const copy = [...breadcrumbItems];
        copy.pop();
        copy[1] = { title: '流程优化任务表' }
        setBreadcrumbItems(copy);
    };

    const handleFlowShow = (taskId: number) => {
        Apis.getFlow(taskId)
            .then(response => response.data)
            .then(data => {
                if (data.isOk) {
                    content = data.data;
                    console.log({ content });
                    const copy = [...breadcrumbItems, { title: '流程查看' }];
                    copy[1] = { title: <Typography.Link onClick={handleBack}>流程优化任务表</Typography.Link> };
                    setBreadcrumbItems(copy);
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', height: 'max(30px, 4%)' }}>
                            <Breadcrumb items={breadcrumbItems} style={{ marginRight: 'auto', marginTop: '10px' }} />
                            {/* <div style={{ marginRight: 'auto' }}>流程优化任务表</div> */}
                            {
                                breadcrumbItems.length === 2 && (
                                    <>
                                        <Button style={{ margin: '0px 20px 20px 0px' }} onClick={() => setIsAddTaskModalDisplay(true)}><PlusOutlined />添加任务</Button>
                                        <Button style={{ margin: '0px 20px 20px 0px' }} onClick={() => handleRefresh(true)}><RedoOutlined />刷   新</Button>
                                    </>
                                )
                            }
                        </div>

                        <Divider style={{ margin: '10px 0 0 0' }} />
                        {
                            breadcrumbItems.length === 2 &&
                            <FlowOptimizationFlowTaskTable
                                data={tableData}
                                onCancelTask={handleCancelTask}
                                onFlowShow={handleFlowShow} />
                        }

                        <div
                            id='graph-container'
                            style={{ height: (breadcrumbItems.length === 3) ? '94%' : '0.01px' }} />
                    </div>
                </Content>
            </Layout>
        </App>
    );
};

export default EditGraphView;