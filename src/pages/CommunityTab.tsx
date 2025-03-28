import { IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonRippleEffect, IonSkeletonText, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from "@ionic/react"
import { Swiper, SwiperSlide } from 'swiper/react';
import PostCard from "../components/PostCard";
import { useRef, useState } from "react";
import { ArticleModule, seiunClient } from "../api";
import 'swiper/css';
import { showTokenInfoMissingDialog } from "../utils/dialogs";
import { resourceBaseUrl } from "../utils/url";


interface PostDetail {
  id: string;
  content: string;
  title: string,
  desc: string,
  cover: string,
}

interface AiPostDetail extends PostDetail {
  tag: string;
}

const CommunityTab: React.FC = () => {
  const ionRouter = useIonRouter();
  const articleModule = new ArticleModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  const [aiPosts, setAiPosts] = useState<AiPostDetail[]>([]);
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const loaded = useRef(false);

  const fetchArticles = async () => {
    const articles = await articleModule.getArticleList();
    const articleDetails = await Promise.all(articles.article_ids?.map(async id => {
      const post = await articleModule.getArticleDetail(id);
      return {
        id: post.id,
        title: post.title,
        desc: post.description,
        content: post.content,
        cover: resourceBaseUrl + "/article-image/" + post.cover_file_name
      };
    }));
    return articleDetails;
  };

  const fetchAiArticles = async () => {
    const articles = await articleModule.getAiArticleList();
    const articleDetails = await Promise.all(articles.ai_article_ids?.map(async id => {
      const post = await articleModule.getAiArticleDetail(id);
      return {
        id: post.ai_article_id,
        content: post.content,
        title: post.title,
        desc: post.description,
        cover: resourceBaseUrl + "/article-image/" + post.cover_file_name,
        tag: post.tag
      };
    }));
    return articleDetails;
  };

  const fetchData = async () => {
    loaded.current = false;
    const [articleDetails, aiArticleDetails] = await Promise.all([fetchArticles(), fetchAiArticles()]);
    loaded.current = true;
    setPosts(articleDetails);
    setAiPosts(aiArticleDetails);
  };

  const doRefresh = async (event: CustomEvent) => {
    await fetchData();
    event.detail.complete();
  }

  useIonViewWillEnter(() => {
    fetchData();
  })

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>社区</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <div className='ion-padding !pt-0'>
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">社区</IonTitle>
            </IonToolbar>
          </IonHeader>

          {
            !loaded.current || aiPosts.length !== 0 && <div className="mt-2 ml-[2px]">
              <p className="text-xl font-semibold">AI 内容专区</p>
              <p className="text-black/50 font-semibold">根据您学习记录自动生成的巩固阅读材料</p>
            </div>
          }
        </div>
        <div>
          <Swiper
            slidesPerView="auto"
            spaceBetween={16}
            className="w-full !pb-4"
            slidesOffsetAfter={16}
            slidesOffsetBefore={16}
          >
            {
              !loaded.current && <IonSkeletonText animated={true} style={{ height: '28rem', width: '85%', borderRadius: '2rem', marginLeft: '1rem' }}></IonSkeletonText>
            }
            {
              aiPosts.map((post, index) => (
                <SwiperSlide key={index} className="!w-[85%] ion-activatable rounded-4xl relative overflow-hidden">
                  <PostCard
                    key={post.id}
                    title={post.title}
                    desc={post.desc}
                    tag={post.tag}
                    id={post.id}
                    cover={post.cover}
                    ai={true}
                    className="h-[28rem]"
                  />
                  <IonRippleEffect />
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
        <div className='ion-padding !pt-0'>
          <div className="mt-2 ml-[2px]">
            <p className="text-xl font-semibold">为您推荐</p>
            <p className="text-black/50 font-semibold">社区中当前的热门文章</p>
          </div>
          <div className="flex flex-col">
            {
              !loaded.current && <IonSkeletonText animated={true} style={{ height: '20rem', borderRadius: '2rem', marginTop: '1rem' }}></IonSkeletonText>
            }
            {
              posts.map((post, index) => (
                <SwiperSlide key={index} className="ion-activatable rounded-4xl relative overflow-hidden mt-4">
                  <PostCard
                    key={post.id}
                    title={post.title}
                    desc={post.desc}
                    id={post.id}
                    cover={post.cover}
                    ai={false}
                    className="h-[20rem]"
                  />
                  <IonRippleEffect />
                </SwiperSlide>
              ))
            }
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CommunityTab;