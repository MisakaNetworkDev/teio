import { IonContent, IonPage } from "@ionic/react";

const LoadingPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent scrollY={false} color="light" fullscreen className="ion-padding">
        <div className="grid place-items-center w-full h-full">
          <div className="w-2/3 space-y-8">
            <img src="/illustrations/loading.svg" alt="loading" />
            <div className="flex flex-row justify-center">
              <span className="text-lg text-[#76b3f6]">加载中...</span>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LoadingPage;