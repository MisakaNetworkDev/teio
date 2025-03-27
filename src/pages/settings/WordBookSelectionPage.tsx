import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonPage, IonProgressBar, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { seiunClient, WordBook, WordBookModule } from "../../api";
import { showTokenInfoMissingDialog } from "../../utils/dialogs";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AuthError, RequestError } from "../../api/core/client";
import { Dialog } from "@capacitor/dialog";

interface WordBookSelectBoxProps {
  id: string,
  name: string,
  learned: number,
  total: number,
  onWordBookSelect: (bookId: string) => void;
}
const WordBookSelectBox: React.FC<WordBookSelectBoxProps> = (props: WordBookSelectBoxProps) => {
  return (
    <IonItem button key={props.id} onClick={() => { props.onWordBookSelect(props.id) }}>
      <div className="w-full py-2.5 mr-1.5 flex flex-row items-center relative overflow-hidden">
        <Icon icon="fluent-emoji:blue-book" className="relative -left-1.5" height={65} />
        <div className="flex flex-col grow">
          <p className="text-xl text-black/80 font-bold">{props.name}</p>
          <span className="flex flex-row text-sm justify-between">
            <p>已学习: {props.learned}</p>
            <p>单词总数: {props.total}</p>
          </span>
          <IonProgressBar class="mt-1.5 mb-1.5" value={props.learned / props.total}></IonProgressBar>
        </div>
      </div>
    </IonItem>
  )
}

const WordBookSelectionPage: React.FC = () => {
  const ionRouter = useIonRouter();
  const wordBookModule = new WordBookModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);

  const onWordBookSelect = async (bookId: string) => {
    try {
      await wordBookModule.selectWordBook(bookId);
      await Dialog.alert({
        title: "选择词书成功",
        message: "",
      });
      ionRouter.goBack();
    } catch (err) {
      if (err instanceof AuthError) return;
      await Dialog.alert({
        title: "选择词书错误",
        message: (err as RequestError).message,
      });
      return;
    }
  }

  useIonViewWillEnter(() => {
    const fetchWordBooks = async () => {
      const books = await wordBookModule.getWordBooks();
      if (books.word_books) {
        setWordBooks(books.word_books);
      }
    }
    fetchWordBooks();
  })

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabbed/learn" text="学习" />
          </IonButtons>
          <IonTitle>选择单词书</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' fullscreen>
        <div className='ion-padding !py-0'>
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">选择单词书</IonTitle>
            </IonToolbar>
          </IonHeader>
        </div>
        <IonList inset>
          {
            wordBooks.map(book => (
              <WordBookSelectBox
                key={book.word_book_id}
                name={book.word_book_name}
                id={book.word_book_id}
                total={book.word_count}
                learned={book.learned_word_count ?? 0}
                onWordBookSelect={onWordBookSelect}
              />
            ))
          }
        </IonList>
      </IonContent>
    </IonPage >
  )
}

export default WordBookSelectionPage;