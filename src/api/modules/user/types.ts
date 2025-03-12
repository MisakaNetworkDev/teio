export enum Gender {
    male = 0,
    female = 1,
    unknown = 2,
}

export interface UserProfile {
    user_name: string;
    nick_name: string;
    avatar_url: string;
    gender: Gender;
}

export interface TokenInfo {
    token: string,
    expire_at: bigint,
}