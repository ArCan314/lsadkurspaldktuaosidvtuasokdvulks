import React from "react";
import styles from "../DetailPanel.module.less";
import { Input } from "antd";
import { IStateTaskArcModel } from '@/types';
import DefaultDetail from "./DefaultDetail";

export interface StateTaskArcDetail {
    model: IStateTaskArcModel;
    onChange: (...args: any[]) => any;
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
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.rho}
                        onChange={(e) => { handleChange('rho', e.target.value) }}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default StateTaskArcDetail;
