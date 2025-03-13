/**
 * Core API SDK for Seiun backend
 * Seiun 后端核心 API SDK
 */

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
    private refreshPromise: Promise<void> | null = null;

    constructor(config: ClientConfig) {
        this.config = {
            tokenKey: 'access_token',
            userIdKey: 'user_id',
            tokenExpireTimeKey: 'expire_time',
            refreshTokenEndpoint: '/user/refresh-token',
            ...config,
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
    async refreshToken() {
        // 如果已经有刷新请求在进行中，直接返回
        if (this.refreshPromise) {
            return this.refreshPromise;
        }
        
        // 如果没有令牌，直接返回
        const token = this.getToken();
        if (!token) {
            return Promise.reject(new Error('token_error'));
        }

        this.refreshPromise = fetch(`${this.config.baseUrl}${this.config.refreshTokenEndpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('token_error');
            }
            return response.json();
        }).then(({ data }: { data: RefreshResponse }) => {
            this.saveToken(data.token, data.user_id, data.expire_at);
        }).catch(error => {
            this.clearToken();
            throw error;
        }).finally(() => {
            this.refreshPromise = null;
        });

        return this.refreshPromise;
    }

    // 核心请求方法
    async request<T>(endpoint: string, options: RequestOptions): Promise<BaseResponse<T>> {
        const { auth = true, skipRefresh = false, ...fetchOptions } = options;
        const url = `${this.config.baseUrl}${endpoint}`;

        if (!skipRefresh && auth) {
            // 检查令牌有效期是否小于 24 小时
            const expireTime = this.getExpireTime();
            if (expireTime) {
                const expireTimeNum = parseInt(expireTime, 10);
                const now = Math.floor(Date.now() / 1000);
                if (expireTimeNum - now < 86400) {
                    await this.refreshToken();
                }
            } else {
                this.clearToken();
                throw new Error('token_error');
            }
        }

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
                throw new Error('token_error');
            }
        }

        // 设置请求选项
        const requestOptions: RequestInit = {
            ...fetchOptions,
            headers,
        };

        // 发送请求
        const response = await fetch(url, requestOptions);
        if (response.status === 401) {
            this.clearToken();
            throw new Error('token_error');
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