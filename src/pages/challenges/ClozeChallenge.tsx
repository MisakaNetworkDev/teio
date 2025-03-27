import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { useRef, useState } from "react";
import ClozeBlank from "../../components/ClozeBlank";
import { ClozeTokens, parseClozeTokens } from "../../utils/challengeParsers";
import AnswerCard from "../../components/AnswerCard";
import { ChallengeModule } from "../../api/modules/challenge/module";
import { seiunClient } from "../../api";
import { showTokenInfoMissingDialog } from "../../utils/dialogs";
import { Dialog } from "@capacitor/dialog";
import { ChallengeType, ClozeTestDetail } from "../../api/modules/challenge/types";
import LoadingPage from "../study_session/LoadingPage";


interface ClozeChallengeData {
  type: string | number;
  content: string;
  selections: { [key: number]: string[] };
  answers: { [key: number]: string };
}

type ClozeSelections = {
  [key: number]: { userSelection: string | null, answer: string }
}

const MAX_RETRIES = 50;

interface ClozeChallengeProps {
  sessionId?: string
  challengeId?: string,
}

const ClozeChallenge: React.FC<ClozeChallengeProps> = (props: ClozeChallengeProps) => {
  const [quizData, setQuizData] = useState<ClozeChallengeData | null>(null);
  const [tokens, setTokens] = useState<ClozeTokens[]>([]);
  const [selections, setSelections] = useState<ClozeSelections>({});
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contentRef = useRef<HTMLIonContentElement>(null);
  const retriesCounter = useRef<number>(0);

  const ionRouter = useIonRouter();
  const challengeModule = new ChallengeModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  useIonViewWillEnter(() => {
    const fetchChallengeData = async () => {
      let clozeDetail: ClozeTestDetail | undefined = undefined;
      while (clozeDetail === undefined && retriesCounter.current <= MAX_RETRIES) {
        if (props.sessionId) {
          clozeDetail = await challengeModule.getSessionChallenge(props.sessionId, ChallengeType.Cloze);
        }

        // 在此等待三秒
        if (clozeDetail === undefined) {
          retriesCounter.current++;
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      if (clozeDetail === undefined) {
        Dialog.alert({
          title: "生成挑战题失败",
          message: "超出最大等待时间",
        })
        return;
      }

      const parseResult = parseClozeTokens(clozeDetail.content);
      setTokens(parseResult);

      const initSelectedAnswers: ClozeSelections = {};
      Object.keys(clozeDetail.answers).forEach(blankIndex => {
        const numberIndex = parseInt(blankIndex);
        initSelectedAnswers[numberIndex] = {
          userSelection: null,
          answer: clozeDetail.answers[numberIndex]
        };
      });
      setSelections(initSelectedAnswers);

      setQuizData(clozeDetail);
    }
    fetchChallengeData();
  });

  const handleAnswerChange = (index: number, selection: string) => {
    const thisSelection = { ...selections };
    thisSelection[index].userSelection = selection;
    setSelections(thisSelection);
    const allAnswered = Object.values(thisSelection).every(selection => selection.userSelection !== null);
    setFinished(allAnswered);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  }

  return (
    <>
      {
        quizData === null && <LoadingPage />
      }
      {
        quizData !== null && (<IonPage>
          <IonHeader translucent={true}>
            <IonToolbar>
              <IonTitle>挑战: {(quizData.type == 1 ? "完形填空" : quizData.type)}</IonTitle>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/tabbed/learn" disabled={!submitted} text="学习" />
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent ref={contentRef} color="light" fullscreen className="ion-padding">
            <IonHeader collapse="condense">
              <IonToolbar color='light'>
                <IonTitle size="large">挑战: {(quizData.type == 1 ? "完形填空" : quizData.type)}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <div className="my-4">
              <div className="text-lg leading-9 whitespace-pre-wrap">
                {tokens.map((token, index) => (
                  token.type === 'text' ?
                    <span key={index} className="inline">{token.content}</span> :
                    <ClozeBlank
                      key={index}
                      className="mx-1"
                      index={token.index!}
                      disabled={submitted}
                      selections={quizData.selections[token.index!]}
                      contentRef={contentRef}
                      onSelectionChange={handleAnswerChange}
                    />
                ))}
              </div>
            </div>
            {
              !submitted &&
              <div className="mb-[100vh]">
                <IonButton expand="block" disabled={!finished} onClick={handleSubmit}>提交答案</IonButton>
              </div>
            }
            <div className="space-y-3">
              {
                submitted && Object.keys(selections).map(blank => {
                  const numberBlankIndex = parseInt(blank);
                  return (
                    <AnswerCard key={numberBlankIndex} index={blank} answer={selections[numberBlankIndex].answer} userSelection={selections[numberBlankIndex].userSelection!} />
                  )
                })
              }
            </div>
          </IonContent>
        </IonPage>)
      }

    </>
  );
}

export default ClozeChallenge;
