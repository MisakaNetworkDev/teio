import { IonActionSheet } from "@ionic/react";
import clsx from "clsx";
import { RefObject, useRef, useState } from "react";

interface ClozeBlankProps {
  index: number,
  selections: string[],
  className: string,
  disabled?: boolean,
  contentRef?: RefObject<HTMLIonContentElement>
  onSelectionChange: (index: number, selection: string) => void,
}

const ClozeBlank: React.FC<ClozeBlankProps> = (props: ClozeBlankProps) => {
  const [selection, setSelection] = useState<string | null>(null);
  const [displayContent, setDisplayContent] = useState<number>(props.index);
  const [isOpen, setIsOpen] = useState(false);

  const yOffsetBefore = useRef<number | null>(null);

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

  const handleBlankClick = async (e: { pageY: number }) => {
    if (e.pageY > window.innerHeight / 2 && props.contentRef?.current) {
      yOffsetBefore.current = (await props.contentRef.current.getScrollElement()).scrollTop;
      props.contentRef.current.scrollToPoint(0, e.pageY + yOffsetBefore.current - window.innerHeight / 2, 400);
    }
    const disabled = props.disabled ?? false;
    if (!disabled) {
      setIsOpen(true);
    }
  }

  const handleDismiss = (event: { detail: any }) => {
    if (yOffsetBefore.current !== null) {
      props.contentRef?.current?.scrollToPoint(0, yOffsetBefore.current, 400);
      yOffsetBefore.current = null;
    }
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
