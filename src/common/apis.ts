import { ITaskTableRowData } from "@/components/FlowOptimizationTaskTable";
import { IExportFormat } from "@/types";
import axios from "axios";

export interface ApiResponse<T = unknown> {
    isOk: boolean;
    msg: string;
    data: T;
}

class ApiConfig {
    private static readonly BASE_HOST_URL = "localhost:3000";
    private static readonly BASE_API_URL = `http://${this.BASE_HOST_URL}/api`;

    public static readonly TASKS = `${ApiConfig.BASE_API_URL}/tasks`;
    public static readonly FLOW = `${ApiConfig.BASE_API_URL}/flow`
};

export default class Apis {
    public static async getTasks() {
        return axios.get<ApiResponse<ITaskTableRowData[]>>(ApiConfig.TASKS);
    }

    public static async addTask(task: IExportFormat | string) {
        return axios.post<ApiResponse>(ApiConfig.TASKS, task, { headers: { "Content-Type": 'text/plain' }});
    }

    public static async cancelTask(id: number) {
        return axios.delete<ApiResponse>(`${ApiConfig.TASKS}/${id}`);
    }

    public static async getFlow(taskId: number) {
        return axios.get<ApiResponse<string>>(`${ApiConfig.FLOW}/${taskId}`); // string of IExportFormat
    }
}