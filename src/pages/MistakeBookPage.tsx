import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import WordItem from "../components/WordItem";
import { MistakeBookModule, MistakeDetail, seiunClient } from "../api";
import { showTokenInfoMissingDialog } from "../utils/dialogs";
import { useState } from "react";

const MistakeBook: React.FC = () => {
  const ionRouter = useIonRouter();
  const mistakeBookModule = new MistakeBookModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  const [wordList, setWordList] = useState<MistakeDetail[]>([]);

  useIonViewWillEnter(() => {
    const fetch = async () => {
      const words = await mistakeBookModule.getMistakes();
      setWordList(words);
    }
    fetch();
  })

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabbed/learn" text="学习" />
          </IonButtons>
          <IonTitle>错题本</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' fullscreen>
        <div className='ion-padding !py-0'>
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">错题本</IonTitle>
            </IonToolbar>
          </IonHeader>
        </div>
        <IonList inset>
          {
            wordList.map(word => (
              <WordItem
                key={word.word_text}
                word_text={word.word_text}
                pronunciation={word.pronunciation}
                definition={word.definition}
                example={word.example_sentence}
              />
            ))
          }
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default MistakeBook;