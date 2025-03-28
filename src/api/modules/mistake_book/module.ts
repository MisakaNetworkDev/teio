import SeiunClient, { AuthFailedCallbackFunction } from "../../core/client";
import { SeiunModule } from "../../core/modules";
import { MistakeDetail } from "./types";

// 错词本模块接口
export class MistakeBookModule extends SeiunModule {
    constructor(client: SeiunClient, authFailedCallback?: AuthFailedCallbackFunction) {
        super(client, '/mistake-book', authFailedCallback);
    }

    async getMistakes() {
        return this.get<MistakeDetail[]>('/mistakes');
    }
}