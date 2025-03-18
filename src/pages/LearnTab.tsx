import { IonContent, IonHeader, IonNavLink, IonPage, IonProgressBar, IonTitle, IonToolbar, IonRippleEffect, IonButton, useIonRouter, useIonViewWillEnter } from "@ionic/react"

import 'swiper/css';
import { Icon } from "@iconify/react";
import { seiunClient } from "../api";

interface FunctionCardProps {
  title: string,
  subTitle: string,
  icon: string,
  component: React.FC
}
const FunctionCard: React.FC<FunctionCardProps> = (props: FunctionCardProps) => {
  return (
    <IonNavLink routerDirection="forward" component={() => props.component}>
      <div className="bg-white rounded-2xl p-4 flex flex-row items-center ion-activatable relative overflow-hidden">
        <Icon icon={props.icon} className="text-[var(--ion-color-primary)]" height={48} />
        <div className="flex flex-col grow mx-4">
          <p className="text-xl text-black/80 font-bold">{props.title}</p>
          <p className="text-black/80">{props.subTitle}</p>
        </div>
        <Icon icon="mingcute:right-line" className="text-black/75 ml-3" height={24} />
        <IonRippleEffect />
      </div>
    </IonNavLink>
  )
}

const LearnTab: React.FC = () => {
  const ionRouter = useIonRouter();
  useIonViewWillEnter(() => {
    if (seiunClient.getToken() === null) {
      ionRouter.push("/login");
    }
  })

  const enterQuiz = () => {
    // ionRouter.push(`/quiz/123`, "forward");
    ionRouter.push(`/wanxing`, "forward");
  }

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>学习</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' fullscreen>
        <div className='ion-padding !pt-0'>
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">学习</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonNavLink routerDirection="forward" component={() => <div></div>}>
            <div className="bg-white rounded-2xl px-3 pt-4 pb-3 mt-2 flex flex-row items-center ion-activatable relative overflow-hidden">
              <Icon icon="fluent-emoji:blue-book" className="relative -left-1.5" height={73} />
              <div className="flex flex-col grow">
                <p className="text-black/80">当前计划</p>
                <p className="text-xl text-black/80 font-bold">英语六级词汇 (CET6)</p>
                <IonProgressBar class="mt-1.5 mb-1.5" value={0.66}></IonProgressBar>
              </div>
              <Icon icon="mingcute:right-line" className="text-black/75 ml-3" height={24} />
              <IonRippleEffect />
            </div>
          </IonNavLink>

          <div className="bg-white rounded-2xl p-5 mt-4 flex flex-col space-y-3">
            <span className="text-xl font-bold px-1">今日计划</span>
            <div className="grid grid-cols-2 px-1">
              <div className="flex flex-col">
                <span className="text-lg">需新学</span>
                <span className="flex flex-row space-x-4 items-end mt-1">
                  <p className="text-5xl font-bold">10</p>
                  <p className="text-xl font-bold">词</p>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg">需巩固</span>
                <span className="flex flex-row space-x-4 items-end mt-1">
                  <p className="text-5xl font-bold">7</p>
                  <p className="text-xl font-bold">词</p>
                </span>
              </div>
            </div>
            <IonButton expand="block" className="mt-2" onClick={enterQuiz}>开始学习</IonButton>
          </div>

          <div className="mt-4 flex flex-col space-y-4">
            <FunctionCard title="听力练习" subTitle="AI 语音包功能上线" icon="ph:headphones-light" component={() => <div></div>} />
            <FunctionCard title="错题本" subTitle="查看往日错题" icon="material-symbols-light:book-outline" component={() => <div></div>} />
            <FunctionCard title="首字母填空" subTitle="AI 智能出题" icon="material-symbols-light:ink-pen-outline-rounded" component={() => <div></div>} />
            <FunctionCard title="作业批改" subTitle="AI 智能整理知识点" icon="material-symbols-light:scan-outline-rounded" component={() => <div></div>} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LearnTab;