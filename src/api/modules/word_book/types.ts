/**
 * WordBookListResp
 */
export interface WordBookListResp {
    code: number;
    data: WordBookListData;
    message: string;
}

/**
 * WordBookListData
 */
export interface WordBookListData {
    word_books: WordBook[];
}

/**
 * WordBook
 */
export interface WordBook {
    daily_plan: number;
    learned_word_count: number;
    remaining_days: number;
    word_book_id: string;
    word_book_name: string;
    word_count: number;
}
