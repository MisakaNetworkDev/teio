import { IonPage, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { showTokenInfoMissingDialog } from "../../utils/dialogs";
import { StudySessionModule } from "../../api/modules/study_session/module";
import { seiunClient } from "../../api";
import { WordSessionDetail } from "../../api/modules/study_session/types";
import { AuthError, RequestError } from "../../api/core/client";
import { Dialog } from "@capacitor/dialog";
import LoadingPage from "./LoadingPage";
import QuickViewPage from "./QuickViewPage";
import WordQuizPage from "./WordQuizPage";
import ClozeChallenge from "../challenges/ClozeChallenge";

const defaultStudySessionDetail = {
  reviewing_word_count: 0,
  studying_word_count: 0,
  session_id: "",
  words: [],
};

const StudySessionPage: React.FC = () => {
  const [sessionStage, setSessionStage] = useState<"loading" | "quick-view" | "word-quiz" | "challenge">("loading");
  const [studySessionDetail, setStudySessionDetail] = useState<WordSessionDetail>(defaultStudySessionDetail);

  const ionRouter = useIonRouter();
  const studySessionModule = new StudySessionModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  useIonViewWillEnter(() => {
    if (sessionStage === 'loading') {
      const initStudySession = async () => {
        try {
          const sessionDetail = await studySessionModule.initStudySession();
          setSessionStage("quick-view");
          setStudySessionDetail(sessionDetail);
          console.log(sessionDetail);
        } catch (err) {
          if (err instanceof AuthError) return;
          await Dialog.alert({
            title: "初始化失败",
            message: (err as RequestError).message,
          });
          return;
        }
      }
      initStudySession();
    }
  })

  const onStartQuiz = () => {
    setSessionStage("word-quiz");
  }

  const onWordQuizFinished = () => {
    setSessionStage("challenge");
  }

  return (
    <IonPage>
      {
        sessionStage === "loading" && <LoadingPage />
      }
      {
        sessionStage === "quick-view" && <QuickViewPage wordList={studySessionDetail.words} onStartQuiz={onStartQuiz} />
      }
      {
        sessionStage === "word-quiz" && <WordQuizPage sessionId={studySessionDetail.session_id} onFinished={onWordQuizFinished} />
      }
      {
        sessionStage === "challenge" && <ClozeChallenge sessionId={studySessionDetail.session_id} />
      }
    </IonPage>
  )
}

export default StudySessionPage;