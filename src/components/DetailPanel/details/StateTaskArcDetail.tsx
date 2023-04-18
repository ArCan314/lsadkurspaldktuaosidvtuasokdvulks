import React from "react";
import styles from "../DetailPanel.module.less";
import { InputNumber } from "antd";
import type { DetailKey, IStateTaskArcModel } from '@/types';
import DefaultDetail from "./DefaultDetail";

export interface StateTaskArcDetail {
    model: IStateTaskArcModel;
    onChange: (key: DetailKey, val: any) => void;
    readOnly: boolean;
}

const StateTaskArcDetail: React.FC<StateTaskArcDetail> = ({ model, onChange: handleChange, readOnly = false, }) => {
    return (
        <div>
            <div className={styles.panelTitle}>状态任务边</div>
            <div className={styles.panelBody}>
                <DefaultDetail model={model} onChange={handleChange} readOnly={readOnly} />
                <div className={styles.panelRow}>
                    <div>百分比: </div>
                    <InputNumber style={{ width: '100%', fontSize: 12 }}
                        placeholder="输入百分比"
                        value={model.rho}
                        max={100}
                        min={0}
                        onChange={val => handleChange('rho', val)}
                        formatter={val => `${val}%`}
                        parser={val => val!.replace('%', '')}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default StateTaskArcDetail;
