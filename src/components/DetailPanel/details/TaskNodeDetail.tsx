import React from "react";
import styles from "../DetailPanel.module.less";
import { Checkbox, Input } from "antd";
import { ITaskNodeModel, IUnitModel } from '@/types';
import DefaultDetail from "./DefaultDetail";

export interface TaskNodeProps {
    model: ITaskNodeModel;
    units: IUnitModel[];
    onChange: (...args: any[]) => any;
    readOnly: boolean;
}

const TaskNodeDetail: React.FC<TaskNodeProps> = ({ model, units, onChange, readOnly = false, }) => {
    return (
        <div>
            <div className={styles.panelTitle}>任务节点</div>
            <div className={styles.panelBody}>
                <DefaultDetail model={model} onChange={onChange} readOnly={readOnly} />
                <div className={styles.panelRow}>
                    <div>节点名称: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.name}
                        onChange={(e) => { onChange('name', e.target.value) }}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>设备ID: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.unitId}
                        onChange={(e) => { onChange('unitId', e.target.value) }}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskNodeDetail;
