import { useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { useRef, useState } from "react";
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

const StudySessionPage: React.FC = () => {
  const isLoaded = useRef(false);

  const [sessionStage, setSessionStage] = useState<"loading" | "quick-view" | "word-quiz" | "challenge">("loading");
  const [studySessionDetail, setStudySessionDetail] = useState<WordSessionDetail>({
    reviewing_word_count: 0,
    studying_word_count: 0,
    session_id: "",
    words: [],
  });

  const ionRouter = useIonRouter();
  const studySessionModule = new StudySessionModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  useIonViewWillEnter(() => {
    const initStudySession = async () => {
      try {
        const sessionDetail = await studySessionModule.initStudySession();
        setStudySessionDetail(sessionDetail);
        console.log(sessionDetail);
        setSessionStage("quick-view");
      } catch (err) {
        if (err instanceof AuthError) return;
        await Dialog.alert({
          title: "初始化失败",
          message: (err as RequestError).message,
        });
        return;
      }
    }
    if (!isLoaded.current) {
      initStudySession();
      isLoaded.current = true;
    }
  })

  const onStartQuiz = () => {
    setSessionStage("word-quiz");
  }

  const onWordQuizFinished = () => {
    setSessionStage("challenge");
  }

  return (
    <>
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
    </>
  )
}

export default StudySessionPage;