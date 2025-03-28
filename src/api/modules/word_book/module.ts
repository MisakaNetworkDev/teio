import SeiunClient, { AuthFailedCallbackFunction } from "../../core/client";
import { SeiunModule } from "../../core/modules";
import { WordBookListData } from "./types";

// 单词书模块接口
export class WordBookModule extends SeiunModule {
    constructor(client: SeiunClient, authFailedCallback?: AuthFailedCallbackFunction) {
        super(client, '/word-book', authFailedCallback);
    }

    async getWordBooks() {
        return this.get<WordBookListData>('/books');
    }

    async selectWordBook(wordBookId: string, dailyPlan: number = 5) {
        return this.post<void>('/select', {
            "word_book_id": wordBookId,
            "daily_plan": dailyPlan,
        });
    }
}