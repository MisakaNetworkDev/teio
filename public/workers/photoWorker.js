self.onmessage = function (e) {
    const { key, photo } = e.data;

    try {
        if (!photo.base64String) {
            throw new Error("无法获取照片数据");
        }

        // 将 Base64 转为 Blob
        const byteCharacters = atob(photo.base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `image/${photo.format}` });

        // 将处理结果返回给主线程
        self.postMessage({
            success: true,
            result: {
                blob,
                format: photo.format,
                key
            }
        });
    } catch (error) {
        self.postMessage({
            success: false,
            error: error.message
        });
    }
};