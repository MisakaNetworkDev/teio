import { IonItem } from "@ionic/react";

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

export default WordItem;