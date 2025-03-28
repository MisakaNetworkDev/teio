/**
 * ArticleListResp
 */
export interface ArticleListResp {
    code: number;
    data: ArticleList;
    message: string;
}

/**
 * ArticleList
 */
export interface ArticleList {
    article_ids: string[];
}

/**
 * ArticleDetail
 */
export interface ArticleDetail {
    content: string;
    article_img_urls: string[];
    cover_file_name: string;
    create_at: number;
    creator_id: string;
    description: string;
    id: string;
    is_pinned: boolean;
    like: number;
    title: string;
}

/**
 * AiArticleDetail
 */
export interface AiArticleDetail {
    ai_article_id: string;
    content: string;
    cover_file_name: string;
    description: string;
    tag: string;
    title: string;
    vocabulary: string;
}

/**
 * AiArticleList
 */
export interface AiArticleList {
    ai_article_ids: string[];
}
