/**
 * StartStudyResp
 */
export interface StartStudyResp {
    code: number;
    data: WordSessionDetail;
    message: string;
}

/**
 * WordSessionDetail
 */
export interface WordSessionDetail {
    reviewing_word_count: number;
    studying_word_count: number;
    session_id: string;
    words: WordDetail[];
}

/**
 * WordDetail
 */
export interface WordDetail {
    definition: string;
    pronunciation: string;
    word_text: string;
    example_sentence: string;
}

/**
 * NextWordDetail
 */
export interface NextWordDetail {
    answer: AnswerDetail;
    example_sentence: string;
    options: OptionDetail[];
    reviewing_word_count: number;
    studying_word_count: number;
}

/**
 * AnswerDetail
 */
export interface AnswerDetail {
    word: string;
    word_id: string;
}

/**
 * OptionDetail
 */
export interface OptionDetail {
    definition: string;
    primary_definition: string;
    pronunciation: string;
    word: string;
    word_id: string;
}

/**
 * WordResultDto
 */
export interface WordResultDto {
    session_id: string;
    word_id: string;
}
