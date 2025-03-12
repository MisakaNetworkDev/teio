import SeiunClient from "../../core/client";
import { SeiunModule } from "../../core/modules";
import { TokenInfo, UserProfile } from "./types";

// 用户模块接口
export class UserModule extends SeiunModule {
    constructor(client: SeiunClient) {
        super(client, '/user');
    }

    // 获取用户信息
    async getUserProfile(userId: string) {
        return this.get<UserProfile>(`/profile/${userId}`, { auth: false });
    }

    // 手机号登录
    async loginViaPhone(phone: string, password: string) {
        return this.post<TokenInfo>(
            '/login',
            {
                'phone_number': phone,
                'password': password,
            },
            { auth: false },
        )
    }

    // 邮箱登录
    async loginViaEmail(email: string, password: string) {
        return this.post<TokenInfo>(
            '/login',
            {
                'email': email,
                'password': password
            },
            { auth: false },
        )
    }

    // 用户名登录
    async loginViaUserName(username: string, password: string) {
        return this.post<TokenInfo>(
            '/login',
            {
                'user_name': username,
                'password': password
            },
            { auth: false },
        )
    }
}