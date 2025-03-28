import { IonContent, IonHeader, IonPage, IonProgressBar, IonTitle, IonToolbar, IonRippleEffect, IonButton, useIonRouter, useIonViewWillEnter } from "@ionic/react"

import { Icon } from "@iconify/react";
import { CurrentPlanData, seiunClient, UserPlanModule } from "../api";
import { Link } from "react-router-dom";
import { showTokenInfoMissingDialog } from "../utils/dialogs";
import { useState } from "react";
import { AuthError, RequestError } from "../api/core/client";

interface FunctionCardProps {
  title: string,
  subTitle: string,
  icon: string,
  to: string,
}
const FunctionCard: React.FC<FunctionCardProps> = (props: FunctionCardProps) => {
  return (
    <Link to={props.to}>
      <div className="bg-white rounded-2xl p-4 flex flex-row items-center ion-activatable relative overflow-hidden">
        <Icon icon={props.icon} className="text-[var(--ion-color-primary)]" height={48} />
        <div className="flex flex-col grow mx-4">
          <p className="text-xl text-black/80 font-bold">{props.title}</p>
          <p className="text-black/80">{props.subTitle}</p>
        </div>
        <Icon icon="mingcute:right-line" className="text-black/75 ml-3" height={24} />
        <IonRippleEffect />
      </div>
    </Link>
  )
}

const LearnTab: React.FC = () => {
  const ionRouter = useIonRouter();
  const userPlanModule = new UserPlanModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  const [currentPlan, setCurrentPlan] = useState<CurrentPlanData>({
    expected_completion_at: 0,
    learned_count: 0,
    book_word_count: Infinity,
    remaining_days: 0,
    daily_plan: 0,
    word_book_id: "",
    word_book_name: "加载中",
  });

  useIonViewWillEnter(() => {
    if (seiunClient.getToken() === null) {
      ionRouter.push("/login");
    }

    const fetchUserPlan = async () => {
      try {
        const currentUserPlan = await userPlanModule.getCurrentUserPlan();
        setCurrentPlan(currentUserPlan);
      } catch (err) {
        if (err instanceof AuthError) return;
        const errorMessage = (err as RequestError).message;
        if (errorMessage === "error.controller.user_plan.user_plan_not_found") {
          setCurrentPlan({ ...currentPlan, word_book_name: "未选择" });
          return;
        }
      }
    }

    fetchUserPlan();
  })

  const enterQuiz = () => {
    // ionRouter.push(`/quiz/123`, "forward");
    ionRouter.push("/study-session", "none");
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

          <Link to="/tabbed/settings/word-book-selection">
            <div className="bg-white rounded-2xl px-3 pt-4 pb-3 mt-2 flex flex-row items-center ion-activatable relative overflow-hidden">
              <div className="w-18 h-18">
                <Icon icon="fluent-emoji:blue-book" className="relative -left-1.5" height={72} />
              </div>
              <div className="flex flex-col grow">
                <p className="text-black/80">当前计划</p>
                <p className="text-xl text-black/80 font-bold">{currentPlan.word_book_name}</p>
                <IonProgressBar class="mt-1.5 mb-1.5" value={currentPlan.learned_count / currentPlan.book_word_count}></IonProgressBar>
              </div>
              <div className="w-6 ml-3">
                <Icon icon="mingcute:right-line" className="text-black/75" height={24} />
              </div>
              <IonRippleEffect />
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-5 mt-4 flex flex-col space-y-3">
            <span className="text-xl font-bold px-1">今日计划</span>
            <div className="grid grid-cols-2 px-1">
              <div className="flex flex-col">
                <span className="text-lg">需新学</span>
                <span className="flex flex-row space-x-4 items-end mt-1">
                  <p className="text-5xl font-bold">{currentPlan.daily_plan}</p>
                  <p className="text-xl font-bold">词</p>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg">再坚持</span>
                <span className="flex flex-row space-x-4 items-end mt-1">
                  <p className="text-5xl font-bold">{currentPlan.remaining_days}</p>
                  <p className="text-xl font-bold">天</p>
                </span>
              </div>
            </div>
            <IonButton expand="block" className="mt-2" onClick={enterQuiz}>开始学习</IonButton>
          </div>

          <div className="mt-4 flex flex-col space-y-4">
            <FunctionCard title="听力练习" subTitle="AI 语音包功能上线" icon="ph:headphones-light" to="#" />
            <FunctionCard title="错题本" subTitle="查看往日错题" icon="material-symbols-light:book-outline" to="/tabbed/mistake-book" />
            <FunctionCard title="首字母填空" subTitle="AI 智能出题" icon="material-symbols-light:ink-pen-outline-rounded" to="#" />
            <FunctionCard title="作业批改" subTitle="AI 智能整理知识点" icon="material-symbols-light:scan-outline-rounded" to="#" />
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LearnTab;