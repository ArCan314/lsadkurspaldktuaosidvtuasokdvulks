import React from "react";
import styles from "../DetailPanel.module.less";
import { Input, InputNumber } from "antd";
import { ITaskStateArcModel, DetailKey } from '@/types';
import DefaultDetail from "./DefaultDetail";

export interface TaskStateArcDetail {
    model: ITaskStateArcModel;
    onChange: (key: DetailKey, val: any) => void;
    readOnly: boolean;
}

const TaskStateArcDetail: React.FC<TaskStateArcDetail> = ({ model, onChange: handleChange, readOnly = false, }) => {
    return (
        <div>
            <div className={styles.panelTitle}>状态任务边</div>
            <div className={styles.panelBody}>
                <DefaultDetail model={model} onChange={handleChange} readOnly={readOnly} />
                <div className={styles.panelRow}>
                    <div>百分比: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.rho}
                        onChange={e => handleChange('rho', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>耗时: </div>
                    <InputNumber style={{ width: '100%', fontSize: 12 }}
                        value={model.duration}
                        min={0}
                        onChange={val => handleChange('duration', val)}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskStateArcDetail;
