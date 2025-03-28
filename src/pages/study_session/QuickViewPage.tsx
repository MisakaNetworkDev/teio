import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonList, IonTitle, IonToolbar } from "@ionic/react";
import { WordDetail } from "../../api/modules/study_session/types";
import WordItem from "../../components/WordItem";

interface QuickViewPageProps {
  wordList: WordDetail[];
  onStartQuiz: () => void;
}

const QuickViewPage: React.FC<QuickViewPageProps> = (props: QuickViewPageProps) => {
  return (
    <>
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
    </>
  )
}

export default QuickViewPage;