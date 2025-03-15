import { IonButton, IonContent, IonPage, useIonAlert } from "@ionic/react";
import { useState } from "react";
import { useParams } from "react-router";
import './QuizPage.css'

interface QuizPageParams {
  quizSessionId: string
}

const QuizPage: React.FC = () => {
  const [presentAlert] = useIonAlert();
  const { quizSessionId } = useParams<QuizPageParams>();
  const [disableButtons, setDisableButtons] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [currentQuiz, setCurrentQuiz] = useState({
    question: {
      word: "hemisphere",
      pronunciation: "/ˈhɛmɪsfɪə/"
    },
    options: [
      {
        id: "0",
        definition: "n.零",
      },
      {
        id: "1",
        definition: "n.发音",
      },
      {
        id: "2",
        definition: "n.(地球的) 半球",
      },
      {
        id: "3",
        definition: "v.提供"
      },
    ],
    answer: {
      id: "2",
    }
  });

  // 处理答案选择逻辑
  const handleOptionSelect = (optionId: string) => {
    // 如果已经选择了答案且按钮被禁用，则不再处理
    if (disableButtons) return;

    // 设置当前选择的选项
    setSelectedOption(optionId);

    // 暂时禁用按钮，防止连续点击
    setDisableButtons(true);

    // 判断答案是否正确
    const isCorrect = optionId === currentQuiz.answer.id;

    if (isCorrect) {
      // 如果答对了，显示提示
      presentAlert({
        header: '恭喜',
        message: '答对了！',
        buttons: ['确定'],
      });
    }

    // 1秒后重置按钮状态
    setTimeout(() => {
      setSelectedOption(null);
      setDisableButtons(false);

      // 这里可以添加跳转到下一题的逻辑
    }, 1000);
  };

  // 确定按钮的CSS类名
  const getButtonClassName = (optionId: string) => {
    if (selectedOption !== null) {
      if (optionId === currentQuiz.answer.id && selectedOption === optionId) {
        return "option option-right";
      } else if (optionId === selectedOption) {
        return "option option-wrong";
      }
    }
    return "option";
  };

  return (
    <IonPage>
      <IonContent scrollY={false} color="light" fullscreen className="ion-padding">
        <div className="grid place-items-center w-full h-full">
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl font-bold text-[var(--ion-color-primary)]">{currentQuiz.question.word}</span>
            <span className="text-xl text-[var(--ion-color-medium)]">{currentQuiz.question.pronunciation}</span>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            {
              currentQuiz.options.map(option => (
                <IonButton
                  key={option.id}
                  id={option.id}
                  className={getButtonClassName(option.id)}
                  expand="block"
                  disabled={disableButtons}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <p className="font-normal">{option.definition}</p>
                </IonButton>
              ))
            }
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default QuizPage;