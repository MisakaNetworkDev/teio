export enum Gender {
    male = 0,
    female = 1,
    unknown = 2,
}

export interface UserProfile {
    user_name: string,
    nick_name: string,
    avatar_url: string | null,
    gender: Gender,
    join_time: number,
    is_banned: boolean,
    description: string | null,
}

export interface TokenInfo {
    token: string,
    user_id: string,
    expire_at: number,
}

export interface UserUpdateProfile {
    description?: null | string;
    gender?: number;
    nick_name?: null | string;
}
