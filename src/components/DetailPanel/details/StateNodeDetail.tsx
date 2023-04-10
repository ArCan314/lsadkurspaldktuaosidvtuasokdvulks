import React from "react";
import styles from "../DetailPanel.module.less";
import { Input, InputNumber } from "antd";
import { DetailKey, IStateNodeModel } from '@/types';
import DefaultDetail from "./DefaultDetail";

export interface StateNodeProps {
    model: IStateNodeModel;
    onChange: (key: DetailKey, val: any) => void;
    readOnly: boolean;
}

const StateNodeDetail: React.FC<StateNodeProps> = ({ model, onChange: handleChange, readOnly = false, }) => {
    return (
        <div>
            <div className={styles.panelTitle}>状态节点</div>
            <div className={styles.panelBody}>
                <DefaultDetail model={model} onChange={handleChange} readOnly={readOnly} />
                <div className={styles.panelRow}>
                    <div>节点名称: </div>
                    <Input style={{ width: '100%', fontSize: 12 }}
                        value={model.name}
                        onChange={e => handleChange('name', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>状态容量: </div>
                    <InputNumber style={{ width: '100%', fontSize: 12 }}
                        min={0}
                        value={model.capacity}
                        onChange={val => handleChange('capacity', val)}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>初始量: </div>
                    <InputNumber style={{ width: '100%', fontSize: 12 }}
                        min={0}
                        value={model.initial}
                        onChange={val => handleChange('initial', val)}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>价格: </div>
                    <InputNumber style={{ width: '100%', fontSize: 12 }}
                        min={0}
                        value={model.price}
                        onChange={val => handleChange('price', val)}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default StateNodeDetail;
