/**
 * Core API SDK for Seiun backend
 * Seiun 后端核心 API SDK
 */

// 认证失败回调函数
type AuthFailedCallbackFunction = () => void | Promise<void>

// API 配置接口
interface ClientConfig {
    baseUrl: string,
    tokenKey?: string,
    userIdKey?: string,
    tokenExpireTimeKey?: string,
    refreshTokenEndpoint?: string,
}

// 刷新令牌响应接口
interface RefreshResponse {
    token: string,
    user_id: string,
    expire_at: number,
}

// 请求选项
interface RequestOptions extends RequestInit {
    auth?: boolean,
    jsonData?: boolean,
}

// 基础相应
interface BaseResponse<T = any> {
    code: number,
    message: string,
    data: T
}

// 认证错误
class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';

        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

// 请求错误
class RequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RequestError';

        Object.setPrototypeOf(this, RequestError.prototype);
    }
}

class SeiunClient {
    private config: ClientConfig;
    private refreshPromise: Promise<void> | null = null;

    constructor(config: ClientConfig) {
        this.config = {
            tokenKey: 'access_token',
            userIdKey: 'user_id',
            tokenExpireTimeKey: 'expire_time',
            refreshTokenEndpoint: '/user/refresh-token',
            ...config,
        }

        // 检查 Token 是否过期
        if (this.getToken() && this.getExpireTime()) {
            const expireTime = parseInt(this.getExpireTime()!, 10);
            const now = Math.floor(Date.now() / 1000);
            if (expireTime < now) {
                // 令牌已过期，清除令牌
                this.clearToken();
            } else if (expireTime - now < 86400) {
                // 令牌将在 24 小时内过期，尝试刷新令牌
                this.refreshToken().catch(() => {
                    this.clearToken();
                });
            }
        }
    }

    // getters
    getToken = () => localStorage.getItem(this.config.tokenKey!);
    getUserId = () => localStorage.getItem(this.config.userIdKey!);
    getExpireTime = () => localStorage.getItem(this.config.tokenExpireTimeKey!);

    // 保存令牌
    saveToken(accessToken: string, userId: string, expireTime: number) {
        localStorage.setItem(this.config.tokenKey!, accessToken);
        localStorage.setItem(this.config.userIdKey!, userId);
        localStorage.setItem(this.config.tokenExpireTimeKey!, expireTime.toString());
    }

    // 清除本地令牌缓存
    clearToken() {
        localStorage.removeItem(this.config.tokenKey!);
        localStorage.removeItem(this.config.userIdKey!);
        localStorage.removeItem(this.config.tokenExpireTimeKey!);
    }

    // 刷新令牌
    async refreshToken(): Promise<void> {
        // 如果已经有刷新请求在进行中，直接返回
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        // 如果没有令牌，直接返回
        const token = this.getToken();
        if (!token) {
            return Promise.reject(new AuthError('Token not found'));
        }

        this.refreshPromise = fetch(`${this.config.baseUrl}${this.config.refreshTokenEndpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            }
        }).then(response => {
            if (!response.ok) {
                throw new RequestError(response.statusText);
            }
            return response.json();
        }).then(({ data }: { data: RefreshResponse }) => {
            this.saveToken(data.token, data.user_id, data.expire_at);
        }).catch(error => {
            throw error;
        }).finally(() => {
            this.refreshPromise = null;
        });

        return this.refreshPromise;
    }

    // 核心请求方法
    async request<T>(endpoint: string, options: RequestOptions, authFailedCallback?: AuthFailedCallbackFunction): Promise<BaseResponse<T>> {
        const { auth = true, jsonData = true, ...fetchOptions } = options;
        const url = `${this.config.baseUrl}${endpoint}`;

        // 设置请求头
        const headers = new Headers(fetchOptions.headers);
        // 如果没设置请求类型 且是 POST PUT PATCH 请求，默认设置为 application/json
        if (jsonData && (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT' || fetchOptions.method === 'PATCH')) {
            headers.set('content-type', 'application/json');
        }

        // 添加认证
        if (auth !== false) {
            const token = this.getToken();
            if (token !== null) {
                headers.set('Authorization', `Bearer ${token}`);
            } else {
                if (authFailedCallback !== undefined) {
                    await authFailedCallback();
                }
                throw new AuthError('Token not found');
            }
        }

        // 设置请求选项
        const requestOptions: RequestInit = {
            ...fetchOptions,
            headers,
        };
        // 序列化 JSON 字符串
        if (jsonData && requestOptions.body) {
            requestOptions.body = JSON.stringify(requestOptions.body);
        }

        // 发送请求
        const response = await fetch(url, requestOptions);
        if (response.status === 401) {
            if (authFailedCallback) {
                this.clearToken();
                await authFailedCallback();
            }
            throw new AuthError(response.statusText);
        }

        // 处理响应
        const data = await response.json();
        if (!response.ok) {
            throw new RequestError(data.message || `Request failed with status ${response.status}: ${response.statusText}`);
        }

        return data as BaseResponse<T>;
    }

    // Get 请求
    async get<T>(endpoint: string, options: RequestOptions = {}, authFailedCallback?: AuthFailedCallbackFunction): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'GET', ...options }, authFailedCallback);
    }

    // Post 请求
    async post<T>(endpoint: string, body: any, options: RequestOptions = {}, authFailedCallback?: AuthFailedCallbackFunction): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'POST', body: body, ...options }, authFailedCallback);
    }

    // Put 请求
    async put<T>(endpoint: string, body: any, options: RequestOptions = {}, authFailedCallback?: AuthFailedCallbackFunction): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'PUT', body: body, ...options }, authFailedCallback);
    }

    // Delete 请求
    async delete<T>(endpoint: string, options: RequestOptions = {}, authFailedCallback?: AuthFailedCallbackFunction): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'DELETE', ...options }, authFailedCallback);
    }

    // Patch 请求
    async patch<T>(endpoint: string, body: any, options: RequestOptions = {}, authFailedCallback?: AuthFailedCallbackFunction): Promise<BaseResponse<T>> {
        return await this.request<T>(endpoint, { method: 'PATCH', body: body, ...options }, authFailedCallback);
    }
}

export default SeiunClient;
export type { ClientConfig, RequestOptions, BaseResponse, AuthFailedCallbackFunction };
export { AuthError, RequestError };