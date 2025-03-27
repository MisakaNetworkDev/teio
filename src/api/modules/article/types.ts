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
    article: string;
    article_img_urls: string[];
    cover_file_name: string;
    create_at: Date;
    creator_id: string;
    description: string;
    id: string;
    is_pinned: boolean;
    like: number;
    title: string;
}