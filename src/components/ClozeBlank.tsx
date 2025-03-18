import { IonActionSheet } from "@ionic/react";
import clsx from "clsx";
import { useState } from "react";

interface ClozeBlankProps {
  index: string,
  selections: string[],
  className: string,
  disabled?: boolean
  onSelectionChange: (index: string, selection: string) => void,
}

const ClozeBlank: React.FC<ClozeBlankProps> = (props: ClozeBlankProps) => {
  const [selection, setSelection] = useState<string | null>(null);
  const [displayContent, setDisplayContent] = useState<string>(props.index);
  const [isOpen, setIsOpen] = useState(false);
  const actionSheetActions = [
    ...props.selections.map(selection => {
      return {
        text: selection,
        data: {
          selection: selection,
        },
      };
    }),
    {
      text: '取消',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    }
  ];

  const handleBlankClick = () => {
    const disabled = props.disabled ?? false;
    if (!disabled) {
      setIsOpen(true);
    }
  }

  const handleDismiss = (event: { detail: any }) => {
    if (!event.detail.data) return;
    const thisSelection = event.detail.data.selection ?? null;
    if (thisSelection) {
      setSelection(thisSelection);
      setDisplayContent(thisSelection);
      props.onSelectionChange(props.index, thisSelection);
    }
  }

  return (
    <>
      <div
        onClick={handleBlankClick}
        className={clsx([
          "inline-block border-b-2 px-2 h-8 text-center border-blue-500 text-blue-500 bg-blue-100 transition-colors duration-75",
          selection === null ? "w-20" : "",
          props.disabled !== true ? "active:bg-blue-200" : "",
          props.className
        ])}
      >
        {displayContent}
      </div>
      <IonActionSheet
        isOpen={isOpen}
        header="选择答案"
        buttons={actionSheetActions}
        onWillDismiss={handleDismiss}
        onDidDismiss={() => setIsOpen(false)}
      ></IonActionSheet>
    </>
  )
}

export default ClozeBlank;
