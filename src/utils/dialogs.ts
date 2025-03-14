import { Dialog } from "@capacitor/dialog";

export const showTokenInfoMissingDialog = async () => {
    await Dialog.alert({
        title: "登录信息失效",
        message: "请重新登录"
    });
}