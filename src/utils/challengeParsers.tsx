export interface ClozeTokens {
    type: 'text' | 'blank',
    content: string,
    index?: string
}

export function parseClozeTokens(content: string): ClozeTokens[] {
    if (!content) return [];

    // 匹配 {$数字} 格式的填空
    const regex = /\{\$(\d+)\}/g;
    const tokens: ClozeTokens[] = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // 逐个匹配填空标记
    while ((match = regex.exec(content)) !== null) {
        // 添加填空前的文本部分（如果有）
        if (match.index > lastIndex) {
            const tokenContent = content.substring(lastIndex, match.index);
            if (tokenContent) {
                tokens.push({
                    type: 'text',
                    content: tokenContent
                });
            }
        }

        // 添加填空部分
        tokens.push({
            type: 'blank',
            content: match[0],
            index: match[1]
        });

        lastIndex = match.index + match[0].length;
    }

    // 添加最后一段文本（如果有）
    if (lastIndex < content.length) {
        tokens.push({
            type: 'text',
            content: content.substring(lastIndex)
        });
    }

    return tokens;
}