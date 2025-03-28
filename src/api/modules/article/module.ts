import SeiunClient, { AuthFailedCallbackFunction } from "../../core/client";
import { SeiunModule } from "../../core/modules";
import { AiArticleDetail, AiArticleList, ArticleDetail, ArticleList } from "./types";

// 文章模块接口
export class ArticleModule extends SeiunModule {
    constructor(client: SeiunClient, authFailedCallback?: AuthFailedCallbackFunction) {
        super(client, '/article', authFailedCallback);
    }

    async getArticleList(len: number = 0, reqType: number = 0, from: string | undefined = undefined, userId: string | undefined = undefined) {
        let params = `?len=${len}&reqType=${reqType}`;
        if (from) params += `&from=${from}`;
        if (userId) params += `&userId=${userId}`;
        return this.get<ArticleList>(`/list${params}`);
    }

    async getArticleDetail(postId: string) {
        return this.get<ArticleDetail>(`/detail/${postId}`)
    }

    async getAiArticleList() {
        return this.get<AiArticleList>('/ai-article-list')
    }

    async getAiArticleDetail(postId: string) {
        return this.get<AiArticleDetail>(`/ai-article?aiArticleId=${postId}`)
    }
}