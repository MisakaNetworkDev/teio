import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import example from '../mocks/example_post.json'
import { useParams } from 'react-router';
import Markdown from 'react-markdown'

interface PostDetailParams {
  id: string;
}

const PostDetail: React.FC = () => {
  const contentDivRef = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef<number | null>(null);

  const { id } = useParams<PostDetailParams>();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<{
    id: string,
    cover: string,
    title: string,
    content: string,
    tag: string,
  } | null>(null);

  useIonViewWillEnter(() => {
    setArticle(example);
    setLoading(false);
  })

  const [scrollOffset, setScrollOffset] = useState<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      const rect = contentDivRef.current?.getBoundingClientRect();
      if (rect && initialPositionRef.current !== null) {
        const offset = initialPositionRef.current - rect.y;
        setScrollOffset(offset > 0 ? offset : 0);
        console.log('当前位置:', rect.y, '初始位置:', initialPositionRef.current, '偏移量:', offset);
      }
    };
    window.addEventListener('ionScroll', handleScroll);
    return () => {
      window.removeEventListener('ionScroll', handleScroll);
    };
  }, []);

  useIonViewDidEnter(() => {
    if (initialPositionRef.current === null) {
      const rect = contentDivRef.current?.getBoundingClientRect();
      const position = rect?.y as number;
      initialPositionRef.current = position;
    }
  });

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/community" text="社区" />
          </IonButtons>
          <IonTitle>
            文章详情
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollEvents={true} className="bg-transparent">
        <div className="relative w-full min-h-full">
          <div
            className="w-full h-[45vh] bg-cover bg-center fixed top-0 left-0 z-10"
            style={{ backgroundImage: `url(${article?.cover})`, height: `calc(45vh+${scrollOffset}px)` }}
          >
          </div>

          <div ref={contentDivRef} className="bg-white rounded-t-[25px] px-6 py-6 relative mt-[calc(40vh-25px)] shadow-lg z-20 min-h-[65vh]">
            <p className="text-3xl font-bold mb-3">{article?.title}</p>
            <Markdown>{article?.content}</Markdown>
            <p className="text-gray-500 mt-5 text-sm">文章ID: {id}</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PostDetail;