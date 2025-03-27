import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { WordDetail } from "../../api/modules/study_session/types";


interface WordItemProps {
  definition: string;
  pronunciation: string;
  word_text: string;
}
const WordItem: React.FC<WordItemProps> = (props: WordItemProps) => {
  return (
    <IonItem>
      <div className="flex flex-col py-2.5 px-1 space-y-1">
        <p className="text-2xl font-bold text-[var(--ion-color-primary)]">{props.word_text}</p>
        <p className="text-black/60">/{props.pronunciation}/</p>
        <p className="whitespace-pre-wrap font-bold text-black/75">{props.definition}</p>
      </div>
    </IonItem>
  )
}

interface QuickViewPageProps {
  wordList: WordDetail[];
  onStartQuiz: () => void;
}
const QuickViewPage: React.FC<QuickViewPageProps> = (props: QuickViewPageProps) => {
  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabbed/learn" text="学习" />
          </IonButtons>
          <IonTitle>今日目标</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' fullscreen>
        <div className='ion-padding !py-0'>
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">今日目标</IonTitle>
            </IonToolbar>
          </IonHeader>
        </div>
        <IonList inset>
          {
            props.wordList.map(word => (
              <WordItem key={word.word_text} word_text={word.word_text} pronunciation={word.pronunciation} definition={word.definition} />
            ))
          }
        </IonList>
        <div className='ion-padding !pt-0'>
          <IonButton expand="block" onClick={props.onStartQuiz}>开始巩固记忆</IonButton>
        </div>
      </IonContent>
    </IonPage >
  )
}

export default QuickViewPage;