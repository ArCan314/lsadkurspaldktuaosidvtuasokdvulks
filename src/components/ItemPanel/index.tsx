import React, { createRef, useEffect } from 'react';
import styles from "./ItemPanel.module.less";
import { Collapse, theme } from "antd";
import Image from 'next/image';

import TaskNodeIcon from "../../../public/svg/task.svg";
import StateNodeIcon from "../../../public/svg/state.svg";
import { ModelClass } from '@/types';
import { EnvironmentFilled } from '@ant-design/icons';

const { Panel } = Collapse;

interface IPanelRowData {
    src: any;
    alt: string;
    shape: ModelClass;
    class: any;
    div: string;
};

const data: IPanelRowData[] = [
    {
        src: TaskNodeIcon,
        alt: 'Task Node',
        shape: 'task-node',
        class: `${styles.img} iconimg`,
        div: '任务节点',
    },
    {
        src: StateNodeIcon,
        alt: 'State Node',
        shape: 'state-node',
        class: `${styles.img} iconimg`,
        div: '状态节点',
    },
]

function generatePanelRow() {
    return data.map((value, index) => {
        return (
            <div key={index}>
                <Image  src={value.src} alt={value.alt} draggable className={value.class} data-shape={value.shape}
                    onDragStart={event => event.dataTransfer.setData('shape', value.shape)}/>
                <div>{value.div}</div>
            </div>
        );
    });
}

const ItemPanel: React.FC = () => {
    const container = createRef<HTMLDivElement>();
    const rows = generatePanelRow();

    useEffect(() => {

    }, []);

    const { token: { colorBgContainer } } = theme.useToken();
    return (
        <div ref={container} className={styles.itemPanel}>
            <Collapse bordered={false} defaultActiveKey={[]} style={{ background: colorBgContainer }}>
                <Panel header={'节点类型'} key="1" forceRender>
                    {...rows}
                </Panel>
            </Collapse>
        </div>
    )
};

export default ItemPanel;
