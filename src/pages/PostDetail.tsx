import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import { useState } from 'react';
import example from '../mocks/example_post.json'
import { useParams } from 'react-router';
import Markdown from 'react-markdown'

interface PostDetailParams {
  id: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<PostDetailParams>();
  const [article, setArticle] = useState<{
    id: string,
    cover: string,
    title: string,
    content: string,
    tag: string,
  } | null>(null);

  useIonViewWillEnter(() => {
    const articleData = example;
    setArticle(articleData);
  })

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabbed/community" text="社区" />
          </IonButtons>
          <IonTitle>
            文章详情
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" fullscreen>
        <div className='flex flex-col space-y-4 ion-padding'>
          <div className='rounded-2xl h-54 bg-center bg-cover' style={{ backgroundImage: `url(${article?.cover})` }} />
          <p className='ml-1 text-4xl font-bold'>{article?.title}</p>
          <div className='flex flex-row'>
            <span className='flex flex-row w-full justify-end items-center space-x-2'>
              <img className='rounded-full w-8 h-8' src="/avatars/default.png" alt="avatar" />
              <p>DeepSeek V3</p>
            </span>
          </div>
        </div>
        <div className='bg-white p-6 pl-7 rounded-t-4xl'>
          <Markdown>{article?.content}</Markdown>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PostDetail;