export enum ChallengeType {
    All,
    Cloze
}

/**
 * QuestionListResp
 */
export interface QuestionListResp {
    code: number;
    data: QuestionListInfo;
    message: string;
}

/**
 * QuestionListInfo
 */
export interface QuestionListInfo {
    question_ids: string[];
}

/**
 * ClozeTestResp
 */
export interface ClozeTestResp {
    code: number;
    data: ClozeTestDetail;
    message: string;
}

/**
 * ClozeTestDetail
 */
export interface ClozeTestDetail {
    analysis: { [key: string]: string };
    answers: { [key: string]: string };
    content: string;
    selections: { [key: string]: string[] };
    type: number;
}
