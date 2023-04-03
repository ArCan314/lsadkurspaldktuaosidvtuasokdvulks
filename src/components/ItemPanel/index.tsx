import React from 'react';
import styles from "./ItemPanel.module.less";
import { Collapse, theme } from "antd";
import Image from 'next/image';

import TaskNodeIcon from "../../../public/svg/task.svg";
import StateNodeIcon from "../../../public/svg/state.svg";

const { Panel } = Collapse;

const ItemPanel: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    return (
        <div className={styles.itemPanel}>
            <Collapse bordered={false} defaultActiveKey={[]} style={{ background: colorBgContainer }}>
                <Panel header={'节点类型'} key="1" forceRender>
                    <Image src={TaskNodeIcon} alt="Task Node" className={styles.img}/>
                    <div>任务节点</div>
                    <Image src={StateNodeIcon} alt="State Node" className={styles.img}/>
                    <div>状态节点</div>
                </Panel>
            </Collapse>
        </div>
    )
};

export default ItemPanel;
