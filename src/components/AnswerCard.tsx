import clsx from "clsx";

interface AnswerCardProps {
  index: string | number
  userSelection: string,
  answer: string,
  explanation?: string,
  isCorrect?: boolean
}

const AnswerCard: React.FC<AnswerCardProps> = (props: AnswerCardProps) => {
  return (
    <div className={clsx(["px-4 py-3 border-l-4", (props.isCorrect || props.answer === props.userSelection) ? "border-emerald-400 bg-emerald-100 text-emerald-600" : "border-red-400 bg-red-100 text-red-600"])}>
      <span className="flex flex-row text-lg text-center space-x-2 font-bold">
        <p>{props.index}.</p>
        <p>答案: {props.answer}</p>
      </span>
      {/* <p className={clsx(["text-lg font-bold", (props.isCorrect || props.answer === props.userSelection) ? "text-green-500" : "text-red-500"])}>你的选择: {props.userSelection}</p> */}
      {
        props.explanation !== undefined && <p className="text-lg">解释: {props.explanation}</p>
      }
    </div>
  )
}

export default AnswerCard;