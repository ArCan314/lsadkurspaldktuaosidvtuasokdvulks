export type ModelClass = "task-node" | "state-node" | "task-state-arc" | "state-task-arc" | "units";

export interface IDefaultModel {
    id?: string;
    name?: string;
    clazz?: ModelClass;
    label?: string;
    x?: number;
    y?: number;
    active?: boolean;
    hideIcon?: boolean;
};

export interface ITaskNodeModel extends IDefaultModel {
    unitId?: number;
};

export interface IStateNodeModel extends IDefaultModel {
    capacity?: number;
    initial?: number;
    price?: number;
};

export interface IUnitModel extends IDefaultModel {
    minInput?: number;
    maxInput?: number;
    startUpCost?: number;
    executeCost?: number;
};

export interface IStateTaskArcModel extends IDefaultModel {
    rho?: number;
};

export interface ITaskStateArcModel extends IDefaultModel {
    rho?: number;
    duration?: number; // in hour 
};