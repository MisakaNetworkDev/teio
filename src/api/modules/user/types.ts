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
}

export interface TokenInfo {
    token: string,
    user_id: string,
    expire_at: number,
}
