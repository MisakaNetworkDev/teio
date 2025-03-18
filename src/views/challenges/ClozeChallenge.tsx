import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import exampleCloze from '../../mocks/example_cloze.json'
import { useState } from "react";
import ClozeBlank from "../../components/ClozeBlank";
import { ClozeTokens, parseClozeTokens } from "../../utils/challengeParsers";
import AnswerCard from "../../components/AnswerCard";


interface ClozeChallengeData {
  type: string;
  content: string;
  selections: { [key: string]: string[] };
  answers: { [key: string]: string };
}

type ClozeSelections = {
  [key: string]: { userSelection: string | null, answer: string }
}

const ClozeChallenge: React.FC = () => {
  const [quizData, setQuizData] = useState<ClozeChallengeData>(exampleCloze);
  const [tokens, setTokens] = useState<ClozeTokens[]>([]);
  const [selections, setSelections] = useState<ClozeSelections>({});
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useIonViewWillEnter(() => {
    const parseResult = parseClozeTokens(quizData.content);
    setTokens(parseResult);

    const initSelectedAnswers: ClozeSelections = {};
    Object.keys(quizData.answers).forEach(blankIndex => {
      initSelectedAnswers[blankIndex] = {
        userSelection: null,
        answer: quizData.answers[blankIndex]
      };
    });
    setSelections(initSelectedAnswers);
  });

  const handleAnswerChange = (index: string, selection: string) => {
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
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>挑战: {quizData.type}</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabbed/learn" disabled={!submitted} text="学习" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={true} color="light" fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar color='light'>
            <IonTitle size="large">挑战: {quizData.type}</IonTitle>
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
                  onSelectionChange={handleAnswerChange}
                />
            ))}
          </div>
        </div>
        {
          !submitted && <IonButton expand="block" disabled={!finished} onClick={handleSubmit}>提交答案</IonButton>
        }
        <div className="space-y-3">
          {
            submitted && Object.keys(selections).map(blank => (
              <AnswerCard index={blank} answer={selections[blank].answer} userSelection={selections[blank].userSelection!} />
            ))
          }
        </div>
      </IonContent>
    </IonPage>
  );
}

export default ClozeChallenge;
