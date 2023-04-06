import React from "react";
import styles from "../DetailPanel.module.less";
import { Input } from "antd";
import { ITaskStateArcModel } from '@/types';
import DefaultDetail from "./DefaultDetail";

export interface TaskStateArcDetail {
    model: ITaskStateArcModel;
    onChange: (...args: any[]) => any;
    readOnly: boolean;
}

const TaskStateArcDetail: React.FC<TaskStateArcDetail> = ({ model, onChange, readOnly = false, }) => {
    return (
        <div>
            <div className={styles.panelTitle}>状态任务边</div>
            <div className={styles.panelBody}>
                <DefaultDetail model={model} onChange={onChange} readOnly={readOnly} />
                <div className={styles.panelRow}>
                    <div>百分比: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.rho}
                        onChange={(e) => { onChange('rho', e.target.value) }}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>耗时: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.duration}
                        onChange={(e) => { onChange('duration', e.target.value) }}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskStateArcDetail;
