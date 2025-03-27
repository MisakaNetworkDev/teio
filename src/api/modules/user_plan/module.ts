import SeiunClient, { AuthFailedCallbackFunction } from "../../core/client";
import { SeiunModule } from "../../core/modules";
import { CurrentPlanData } from "./types";

// 用户计划模块接口
export class UserPlanModule extends SeiunModule {
    constructor(client: SeiunClient, authFailedCallback?: AuthFailedCallbackFunction) {
        super(client, '/user-plan', authFailedCallback);
    }

    getCurrentUserPlan() {
        return this.get<CurrentPlanData>('/current')
    }
}