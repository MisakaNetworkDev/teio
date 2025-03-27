function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        // 随机选择一个位置
        const j = Math.floor(Math.random() * (i + 1));
        // 交换元素
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export { shuffleArray };