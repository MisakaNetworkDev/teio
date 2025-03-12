/**
 * Core API SDK for Seiun backend
 * Seiun 后端核心 API SDK
 */

// API 配置接口
interface ClientConfig {
    baseUrl: string,
    tokenKey?: string,
    tokenExpireTimeKey?: string,
    refreshTokenEndpoint?: string,
}

// 请求选项
interface RequestOptions extends RequestInit {
    auth?: boolean,
    skipRefresh?: boolean,
}

// 基础相应
interface BaseResponse<T = any> {
    code: number,
    message: string,
    data: T
}

class SeiunClient {
    private config: ClientConfig;
    private refreshPromise: Promise<string> | null = null;

    constructor(config: ClientConfig) {
        this.config = {
            tokenKey: 'access_token',
            tokenExpireTimeKey: 'expire_time',
            refreshTokenEndpoint: '/auth/refresh',
            ...config,
        }
        this.refreshToken();
    }

    // getters
    getToken = () => localStorage.getItem(this.config.tokenKey!);
    getExpireTime = () => localStorage.getItem(this.config.tokenExpireTimeKey!);

    // 保存令牌
    saveToken(accessToken: string, expireTime: bigint) {
        localStorage.setItem(this.config.tokenKey!, accessToken);
        localStorage.setItem(this.config.tokenExpireTimeKey!, expireTime.toString());
    }

    // 清除本地令牌缓存
    clearToken() {
        localStorage.removeItem(this.config.tokenKey!);
        localStorage.removeItem(this.config.tokenExpireTimeKey!);
    }

    // 刷新令牌
    async refreshToken() {
        // TODO: 实现刷新令牌逻辑
    }

    // 核心请求方法
    async request<T>(endpoint: string, options: RequestOptions): Promise<BaseResponse<T>> {
        const { auth = true, skipRefresh = false, ...fetchOptions } = options;
        const url = `${this.config.baseUrl}${endpoint}`;

        // 设置请求头
        const headers = new Headers(fetchOptions.headers);
        // 如果没设置请求类型 且是 POST 或 PUT 请求，默认设置为 application/json
        if (!headers.has('content-type') && (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT')) {
            headers.set('content-type', 'application/json');
        }
        // 添加认证
        if (auth) {
            const token = this.getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            } else {
                throw new Error('No token found');
            }
        }

        // 设置请求选项
        const requestOptions: RequestInit = {
            ...fetchOptions,
            headers,
        };

        const response = await fetch(url, requestOptions);
        
        if (!skipRefresh) {
            // TODO: 处理 Token 过期
        }

        // 处理响应
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data as BaseResponse<T>;
    }

    // Get 请求
    async get<T>(endpoint: string, options: RequestOptions = {}): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'GET', ...options });
    }

    // Post 请求
    async post<T>(endpoint: string, body: any, options: RequestOptions = {}): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options });
    }

    // Put 请求
    async put<T>(endpoint: string, body: any, options: RequestOptions = {}): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options });
    }

    // Delete 请求
    async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'DELETE', ...options });
    }
}

export default SeiunClient;
export type { ClientConfig, RequestOptions, BaseResponse };