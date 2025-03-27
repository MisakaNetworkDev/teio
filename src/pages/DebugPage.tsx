import { IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { baseUrl } from "../utils/url";
import { useState } from "react";

const DebugPage: React.FC = () => {
  const [serverUrl, setServerUrl] = useState<string>(baseUrl ?? "");

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>调试设置</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' fullscreen>
        <div className='ion-padding !pt-0'>
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">调试设置</IonTitle>
            </IonToolbar>
          </IonHeader>
        </div>
        <IonList inset>
          <IonItem>
            <IonInput label="服务器 URL" type="url" value={serverUrl} onIonChange={e => { setServerUrl(e.detail.value ?? "") }}></IonInput>
          </IonItem>
          <IonItem button onClick={() => { localStorage.setItem('custom-server-url', serverUrl) }}>设置</IonItem>
          <IonItem button onClick={() => { localStorage.setItem('custom-server-url', import.meta.env.VITE_API_BASE_URL) }}>清除</IonItem>
        </IonList>
        <IonList inset>
          <IonItem button>完形填空调试页</IonItem>
          <IonItem button href="/debug/word-quiz">单词会话调试页</IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default DebugPage;