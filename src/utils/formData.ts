import { Photo } from "@capacitor/camera";

const photoToFormDataFallback = (key: string, photo: Photo) => {
    if (!photo.base64String) {
        throw new Error("无法获取照片数据");
    }
    const formData = new FormData();

    const byteCharacters = atob(photo.base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: `image/${photo.format}` });

    // 将Blob作为文件添加到FormData
    formData.append(key, blob, `avatar.${photo.format}`);

    return formData;
}

export const photoToFormData = (key: string, photo: Photo): Promise<FormData> => {
    return new Promise((resolve, reject) => {
        try {
            const worker = new Worker('/workers/photoWorker.js');

            // 监听 Worker 返回的消息
            worker.onmessage = (event) => {
                worker.terminate();

                if (event.data.success) {
                    const { blob, format, key } = event.data.result;
                    const formData = new FormData();
                    formData.append(key, blob, `avatar.${format}`);
                    resolve(formData);
                } else {
                    reject(new Error(event.data.error));
                }
            }

            // 监听 Worker 错误
            worker.onerror = (error) => {
                worker.terminate();
                reject(error);
            };

            // 发送数据给 Worker 处理
            worker.postMessage({ key, photo });
        } catch (error) {
            console.warn('Web Worker 创建失败，回退到主线程处理', error);
            try {
                resolve(photoToFormDataFallback(key, photo));
            } catch (fallbackError) {
                reject(fallbackError);
            }
        }
    })
}
