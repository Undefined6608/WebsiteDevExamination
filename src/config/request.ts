import PubSub from "pubsub-js";

export const BASE_URL = '/api'; // API地址

interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';
export const handlerError = (type: NotificationType, description: string, message?: string | '请求失败') => {
    return PubSub.publish('tips', {type: type, message: message, description: description});
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
        throw new Error('网络请求失败');
    }
    return await response.json();
}

export async function get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(BASE_URL + url);
    return await handleResponse<T>(response);
}

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