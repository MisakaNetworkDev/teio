import SeiunClient, { AuthFailedCallbackFunction } from "../../core/client";
import { SeiunModule } from "../../core/modules";
import { ChallengeType, ClozeTestDetail, QuestionListInfo } from "./types";

// 单词书模块接口
export class ChallengeModule extends SeiunModule {
    constructor(client: SeiunClient, authFailedCallback?: AuthFailedCallbackFunction) {
        super(client, '/challenge', authFailedCallback);
    }

    async getUserChallengeList(challengeType: ChallengeType) {
        return this.get<QuestionListInfo>(`/list?challengeType=${challengeType}`);
    }

    async getClozeDetail(challengeId: string) {
        return this.get<ClozeTestDetail>(`/cloze-test?questionId=${challengeId}`);
    }

    async getSessionChallenge(sessionId: string, challengeType: ChallengeType) {
        return this.get<ClozeTestDetail>(`/session-challenge?sessionId=${sessionId}&challengeType=${challengeType}`);
    }
}