import React from "react";
import styles from "../DetailPanel.module.less";
import { Checkbox, Input } from "antd";
import { DetailKey, IDefaultModel } from '@/types';

export interface DefaultProps {
    model: IDefaultModel;
    onChange: (key: DetailKey, val: any) => void;
    readOnly: boolean;
}

const DefaultDetail: React.FC<DefaultProps> = ({ model, onChange: handleChange, readOnly = false, }) => {
    return (
        <>
            <div className={styles.panelRow}>
                <div>标签: </div>
                <Input
                    style={{ width: '100%', fontSize: 12 }}
                    value={model.label}
                    // onChange={e => handleChange('label', e.target.value)}
                    disabled={false}
                />
            </div>
            {/* <div className={styles.panelRow}>
                <Checkbox onChange={(e) => handleChange('hideIcon', e.target.checked)}
                    disabled={readOnly}
                    checked={!!model.hideIcon}>隐藏图标</Checkbox>
            </div> */}
        </>
    );
};

export default DefaultDetail;
