import React from "react";
import styles from "../DetailPanel.module.less";
import { Input } from "antd";
import { IStateNodeModel } from '@/types';
import DefaultDetail from "./DefaultDetail";

export interface StateNodeProps {
    model: IStateNodeModel;
    onChange: (...args: any[]) => any;
    readOnly: boolean;
}

const StateNodeDetail: React.FC<StateNodeProps> = ({ model, onChange, readOnly = false, }) => {
    return (
        <div>
            <div className={styles.panelTitle}>状态节点</div>
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
                    <div>状态容量: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.capacity}
                        onChange={(e) => { onChange('capacity', e.target.value) }}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>初始量: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.initial}
                        onChange={(e) => { onChange('initial', e.target.value) }}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>价格: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.price}
                        onChange={(e) => { onChange('price', e.target.value) }}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default StateNodeDetail;
