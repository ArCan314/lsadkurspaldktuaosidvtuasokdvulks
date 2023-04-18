import React from "react";
import styles from "../DetailPanel.module.less";
import { Input, Select } from "antd";
import type { ITaskNodeModel, IUnitModel, DetailKey } from '@/types';
import DefaultDetail from "./DefaultDetail";
import _ from "lodash";
import { isUnit } from "@/views/EditFlowChartView/utils";

export interface TaskNodeProps {
    model: ITaskNodeModel;
    units: IUnitModel[];
    onChange: (key: DetailKey, val: any) => void;
    readOnly: boolean;
}

const TaskNodeDetail: React.FC<TaskNodeProps> = ({ model, units, onChange: handleChange, readOnly = false, }) => {
    const options: { value: string, label: string }[] =
        units.filter(val => val.id !== undefined && isUnit(val.id))
            .map(val => ({
                value: val.id!,
                label: `${val.name ?? '设备'}-${val.id!.split(': ')[1]}`
            }));

    return (
        <div>
            <div className={styles.panelTitle}>任务节点</div>
            <div className={styles.panelBody}>
                <DefaultDetail model={model} onChange={handleChange} readOnly={readOnly} />
                <div className={styles.panelRow}>
                    <div>节点名称: </div>
                    <Input
                        style={{ width: '100%', fontSize: 12 }}
                        placeholder="输入节点名称"
                        value={model.name}
                        onChange={e => handleChange('name', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>设备: </div>
                    <Select
                        style={{ width: '100%', fontSize: 12 }}
                        placeholder='选择设备'
                        options={options}
                        value={model.unitId}
                        onChange={val => handleChange('unitId', val)}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskNodeDetail;
