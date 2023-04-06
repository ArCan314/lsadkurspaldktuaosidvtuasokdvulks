import React from "react";
import styles from "../DetailPanel.module.less";
import { Checkbox, Input } from "antd";
import { IDefaultModel } from '@/types';

export interface DefaultProps {
    model: IDefaultModel;
    onChange: (...args: any[]) => any;
    readOnly: boolean;
}

const DefaultDetail: React.FC<DefaultProps> = ({ model, onChange, readOnly = false, }) => {
    return (
        <>
            <div className={styles.panelRow}>
                <div>标签: </div>
                <Input style={{ width: '100%', fontSize: 12 }}
                    value={model.label}
                    onChange={(e) => onChange('label', e.target.value)}
                    disabled={readOnly}
                />
            </div>
            <div className={styles.panelRow}>
                <Checkbox onChange={(e) => onChange('hideIcon', e.target.checked)}
                    disabled={readOnly}
                    checked={!!model.hideIcon}>隐藏图标</Checkbox>
            </div>
        </>
    );
};

export default DefaultDetail;
