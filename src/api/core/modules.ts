import SeiunClient, { AuthFailedCallbackFunction, RequestOptions } from "./client";

export abstract class SeiunModule {
    protected client: SeiunClient;
    protected basePath: string;
    protected authFailedCallback?: AuthFailedCallbackFunction;

    constructor(client: SeiunClient, basePath: string, authFailedCallback?: AuthFailedCallbackFunction) {
        this.client = client;
        this.basePath = basePath;
        this.authFailedCallback = authFailedCallback;
    }

    // 获取完整的请求 URL
    // 例如: /api/v1/user
    protected getFullUrl(endpoint: string): string {
        return `${this.basePath}${endpoint}`;
    }

    // Get 方法
    protected async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const response = await this.client.get<T>(this.getFullUrl(endpoint), options, this.authFailedCallback);
        return response.data;
    }

    // Post 方法
    protected async post<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
        const response = await this.client.post<T>(this.getFullUrl(endpoint), body, options, this.authFailedCallback);
        return response.data;
    }

    // Put 方法
    protected async put<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
        const response = await this.client.put<T>(this.getFullUrl(endpoint), body, options, this.authFailedCallback);
        return response.data;
    }

    // Delete 方法
    protected async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const response = await this.client.delete<T>(this.getFullUrl(endpoint), options, this.authFailedCallback);
        return response.data;
    }

    // Patch 方法
    protected async patch<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
        const response = await this.client.patch<T>(this.getFullUrl(endpoint), body, options, this.authFailedCallback);
        return response.data;
    }
}