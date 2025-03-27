import { IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { seiunClient, TokenInfo, UserModule } from "../api";
import { Dialog } from "@capacitor/dialog";
import { Link } from "react-router-dom";
import { ScreenOrientation } from '@capacitor/screen-orientation';

const LoginPage: React.FC = () => {
  const [loginMode, setLoginMode] = useState<"phone" | "email" | "username">("phone");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const userModule = new UserModule(seiunClient);
  const ionRouter = useIonRouter();

  const login = async () => {
    let tokenInfo: TokenInfo | null = null;
    try {
      if (loginMode === "phone") {
        tokenInfo = await userModule.loginViaPhone(phoneNumber, password);
      }
      if (loginMode === "email") {
        tokenInfo = await userModule.loginViaEmail(email, password);
      }
      if (loginMode === "username") {
        tokenInfo = await userModule.loginViaUserName(userName, password);
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      const dialogOption = {
        title: "登录失败",
        message: "",
      };
      console.error(errorMessage);
      if (errorMessage === "error.controller.any.param_valid_failed") {
        dialogOption.message = "用户名、账号、手机号或密码格式错误！";
      } else if (errorMessage === "error.controller.user.login_failed") {
        dialogOption.message = "账号或密码错误！";
      } else {
        dialogOption.message = errorMessage;
      }
      Dialog.alert(dialogOption);
      return;
    }

    if (tokenInfo) {
      seiunClient.saveToken(tokenInfo.token, tokenInfo.user_id, tokenInfo.expire_at);
      Dialog.alert({
        title: "登录成功",
        message: "开始学习吧！",
      });
      ionRouter.push("/tabbed", "root");
    }
  }

  useIonViewWillEnter(() => {
    // 锁定屏幕旋转
    ScreenOrientation.lock({
      orientation: "portrait"
    }).catch(err => {
      console.warn(err);
    });
  })

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>登录</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color='light' fullscreen scrollY={false}>
        <div className="ion-padding !pb-0">
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">登录</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonSegment className="mt-4" value={loginMode} onIonChange={e => setLoginMode(e.detail.value as "phone" | "email" | "username")}>
            <IonSegmentButton value="phone" contentId="phone">
              <IonLabel>手机号登录</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="email" contentId="email">
              <IonLabel>邮箱登录</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="username" contentId="username">
              <IonLabel>用户名登录</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        <IonSegmentView>
          <IonSegmentContent id="phone">
            <IonList inset>
              <IonItem>
                <IonInput label="手机号" type="tel" value={phoneNumber} onIonInput={e => { setPhoneNumber(e.detail.value ?? "") }}></IonInput>
              </IonItem>
              <IonItem>
                <IonInput label="密码" type="password" value={password} onIonInput={e => { setPassword(e.detail.value ?? "") }}></IonInput>
              </IonItem>
            </IonList>
            <IonList inset>
              <IonItem button detail={false} onClick={login}>
                <p className="w-full text-center text-[var(--ion-color-primary)]">
                  登录
                </p>
              </IonItem>
            </IonList>
          </IonSegmentContent>
          <IonSegmentContent id="email">
            <IonList inset>
              <IonItem>
                <IonInput label="邮箱" type="email" value={email} onIonInput={e => { setEmail(e.detail.value ?? "") }}></IonInput>
              </IonItem>
              <IonItem>
                <IonInput label="密码" type="password" value={password} onIonInput={e => { setPassword(e.detail.value ?? "") }}></IonInput>
              </IonItem>
            </IonList>
            <IonList inset>
              <IonItem button detail={false} onClick={login}>
                <p className="w-full text-center text-[var(--ion-color-primary)]">
                  登录
                </p>
              </IonItem>
            </IonList>
          </IonSegmentContent>
          <IonSegmentContent id="username">
            <IonList inset>
              <IonItem>
                <IonInput label="用户名" type="text" value={userName} onIonInput={e => { setUserName(e.detail.value ?? "") }}></IonInput>
              </IonItem>
              <IonItem>
                <IonInput label="密码" type="password" value={password} onIonInput={e => { setPassword(e.detail.value ?? "") }}></IonInput>
              </IonItem>
            </IonList>
            <IonList inset>
              <IonItem button detail={false} onClick={login}>
                <p className="w-full text-center text-[var(--ion-color-primary)]">
                  登录
                </p>
              </IonItem>
            </IonList>
          </IonSegmentContent>
        </IonSegmentView>
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-row space-x-5 place-items-center">
          <Link to='/forgot-password'>忘记密码</Link>
          <span className="text-[var(--ion-color-medium)]">|</span>
          <Link to='register'>注册</Link>
        </div>
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-row space-x-5 place-items-center">
          <Link to='/debug'>调试</Link>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LoginPage;