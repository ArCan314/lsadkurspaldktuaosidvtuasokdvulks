import React from 'react';
import styles from "./DetailPanel.module.less";
import { theme } from 'antd';
import { IDefaultModel, IUnitModel } from '@/types';
import StateNodeDetail from './details/StateNodeDetail';
import TaskNodeDetail from './details/TaskNodeDetail';
import StateTaskArcDetail from './details/StateTaskArcDetail';
import TaskStateArcDetail from './details/TaskStateArcDetail';

export interface IDetailProps {
    model: IDefaultModel;
    units: IUnitModel[];
    onChange: (...args: any[]) => any;
    readonly: boolean;
};

const DetailPanel: React.FC<IDetailProps> = ({ model, units, onChange, readonly = false }) => {
    const { token: { colorBgContainer } } = theme.useToken();
    return (
        <div className={styles.detailPanel} style={{ background: colorBgContainer }}>
            {model.clazz == "state-node" && <StateNodeDetail model={model} onChange={onChange} readOnly={readonly} />}
            {model.clazz == "task-node" && <TaskNodeDetail model={model} units={units} onChange={onChange} readOnly={readonly} />}
            {model.clazz == "state-task-arc" && <StateTaskArcDetail model={model} onChange={onChange} readOnly={readonly} />}
            {model.clazz == "task-state-arc" && <TaskStateArcDetail model={model} onChange={onChange} readOnly={readonly} />}
        </div>
    );
};

export default DetailPanel;
