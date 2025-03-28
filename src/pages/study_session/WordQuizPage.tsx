import { IonButton, IonContent, IonIcon, useIonRouter } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { StudySessionModule } from "../../api/modules/study_session/module";
import { showTokenInfoMissingDialog } from "../../utils/dialogs";
import { seiunClient } from "../../api";
import { AuthError, RequestError } from "../../api/core/client";
import { Dialog } from "@capacitor/dialog";
import { shuffleArray } from "../../utils/arrays";
import { Howl } from "howler";
import { volumeHighOutline } from "ionicons/icons";
import clsx from "clsx";
import './WordQuizPage.css'
import { resourceBaseUrl } from "../../utils/url";

interface QuizPageProps {
  sessionId?: string;
  onFinished: () => void;
}

interface QuizDetail {
  question: {
    word: string,
    pronunciation: string,
    audio?: string,
    image?: string,
  },
  options:
  {
    id: string,
    definition: string,
  }[],
  answer: {
    id: string,
  },
}

const WordQuizPage: React.FC<QuizPageProps> = (props: QuizPageProps) => {
  const [disableButtons, setDisableButtons] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizDetail>({
    question: {
      word: "",
      pronunciation: ""
    },
    options: [
      {
        id: "0",
        definition: "",
      },
      {
        id: "1",
        definition: "",
      },
      {
        id: "2",
        definition: "",
      },
      {
        id: "3",
        definition: ""
      },
    ],
    answer: {
      id: "-1",
    }
  });


  const correctSound = useRef(new Howl({ src: ["/sfx/correct.mp3"] }));
  const wrongSound = useRef(new Howl({ src: ["/sfx/wrong.mp3"] }));

  const [sound, setSound] = useState<Howl | null>(null);

  const ionRouter = useIonRouter();
  const studySessionModule = new StudySessionModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  const fetchNextWord = async () => {
    if (!props.sessionId) return;
    try {
      const nextWord = await studySessionModule.getNextWord(props.sessionId);
      if (nextWord) {
        const question = nextWord.options.filter(option => option.word_id === nextWord.answer.word_id)[0];
        setCurrentQuiz({
          question: {
            ...question,
            audio: `${resourceBaseUrl}/word-audio/${question.word_id}.wav`,
            image: `${resourceBaseUrl}/word-image/${question.word_id}.webp`
          },
          options: shuffleArray(nextWord.options.map(opt => {
            return {
              id: opt.word_id,
              definition: opt.primary_definition,
            }
          })),
          answer: {
            id: nextWord.answer.word_id,
          },
        });
        // init sounds
        setSound(new Howl({
          src: [`${resourceBaseUrl}/word-audio/${question.word_id}.wav`],
          autoplay: true,
        }));
      } else {
        props.onFinished();
      }
    } catch (err) {
      if (err instanceof AuthError) return;
      await Dialog.alert({
        title: "单词加载错误",
        message: (err as RequestError).message,
      });
      return;
    }
  }

  useEffect(() => {
    fetchNextWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playSound = () => {
    if (sound !== null) {
      sound.play();
    }
  }

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
      correctSound.current.play();
    } else {
      wrongSound.current.play();
    }

    // 1秒后重置按钮状态
    setTimeout(async () => {
      setSelectedOption(null);
      setDisableButtons(false);

      if (props.sessionId) {
        if (isCorrect) {
          await studySessionModule.reportCorrect(props.sessionId, currentQuiz.answer.id);
        } else {
          await studySessionModule.reportWrong(props.sessionId, currentQuiz.answer.id);
        }
      }
      fetchNextWord();
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
    <>
      <IonContent scrollY={false} color="light" fullscreen className="ion-padding">
        <div className="grid place-items-center w-full h-full">
          <div className="flex flex-col place-items-center w-full">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <span className="text-4xl font-bold text-[var(--ion-color-primary)]">{currentQuiz.question.word}</span>
              <span className="flex flex-row place-items-center space-x-3">
                <span className="text-xl text-[var(--ion-color-medium)]">/{currentQuiz.question.pronunciation}/</span>
                {
                  currentQuiz.question.audio && <IonIcon className="w-6 text-[var(--ion-color-primary)]" onClick={playSound} icon={volumeHighOutline} size="large" />
                }
              </span>
            </div>
            <div style={{ backgroundImage: `url(${currentQuiz.question.image})` }} className="w-4/5 h-52 bg-center bg-cover rounded-2xl" />
            <div className="flex flex-col space-y-3 w-full mt-12">
              {
                currentQuiz.options.map(option => (
                  <IonButton
                    key={option.id}
                    id={option.id}
                    className={clsx([getButtonClassName(option.id)])}
                    expand="block"
                    disabled={disableButtons}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <p className="font-normal line-clamp-1 leading-5">{option.definition}</p>
                  </IonButton>
                ))
              }
            </div>
          </div>
        </div>
      </IonContent>
    </>
  )
}

export default WordQuizPage;