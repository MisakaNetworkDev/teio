import SeiunClient, { AuthFailedCallbackFunction } from "../../core/client";
import { SeiunModule } from "../../core/modules";
import { NextWordDetail, WordSessionDetail } from "./types";

// 单词书模块接口
export class StudySessionModule extends SeiunModule {
    constructor(client: SeiunClient, authFailedCallback?: AuthFailedCallbackFunction) {
        super(client, '/session', authFailedCallback);
    }

    async initStudySession() {
        return this.post<WordSessionDetail>('/init');
    }

    async getNextWord(sessionId: string) {
        return this.get<NextWordDetail>(`/next-word?sessionId=${sessionId}`)
    }

    async reportCorrect(sessionId: string, wordId: string) {
        return this.post<void>('/correct', {
            word_id: wordId,
            session_id: sessionId,
        })
    }

    async reportWrong(sessionId: string, wordId: string) {
        return this.post<void>('/wrong', {
            word_id: wordId,
            session_id: sessionId,
        })
    }
}