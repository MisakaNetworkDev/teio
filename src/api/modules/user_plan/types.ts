/**
 * CurrentWordBookResp
 */
export interface CurrentWordBookResp {
    code: number;
    data: CurrentPlanData;
    message: string;
}

/**
 * CurrentPlanData
 */
export interface CurrentPlanData {
    book_word_count: number;
    daily_plan: number;
    expected_completion_at: number;
    learned_count: number;
    remaining_days: number;
    word_book_id: string;
    word_book_name: string;
}
