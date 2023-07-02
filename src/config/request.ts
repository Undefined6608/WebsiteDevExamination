import PubSub from "pubsub-js";
import {NotificationType} from "./publicInterface";

// 定义后端地址
export const BASE_URL = '/api';

// 定义返回值类型模型
// T:接受的返回值类型
interface ApiResponse<T> {
    // 响应值
    code: number;
    // 响应信息
    msg: string;
    // 响应数据
    data: T;
}

// 网络连接失败
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
        throw new Error('网络请求失败');
    }
    return await response.json();
}

// get请求
export async function get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(BASE_URL + url);
    return await handleResponse<T>(response);
}

// post请求
export async function post<T>(url: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(BASE_URL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return await handleResponse<T>(response);
}