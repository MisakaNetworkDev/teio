import { IonContent, IonHeader, IonPage, IonRippleEffect, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from "@ionic/react"
import { Swiper, SwiperSlide } from 'swiper/react';
import PostCard from "../components/PostCard";
import { useState } from "react";
import exmaplePosts from '../mocks/example_post.json'
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

const CommunityTab: React.FC = () => {
  const ionRouter = useIonRouter();
  const articleModule = new ArticleModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  const [aiPosts, setAiPosts] = useState(exmaplePosts);
  const [posts, setPosts] = useState<PostDetail[]>([]);

  useIonViewWillEnter(() => {
    const fetchPosts = async () => {
      const articles = await articleModule.getArticleList();
      const articleDetails = await Promise.all(articles.article_ids?.map(id => {
        return articleModule.getArticleDetail(id);
      }));
      setPosts(articleDetails.map(post => {
        return {
          id: post.id,
          title: post.title,
          desc: post.description,
          content: post.article,
          cover: resourceBaseUrl + "/article-image/" + post.cover_file_name
        }
      }))
    }
    fetchPosts()
  })

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>社区</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' fullscreen>
        <div className='ion-padding !pt-0'>
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">社区</IonTitle>
            </IonToolbar>
          </IonHeader>

          <div className="mt-2 ml-[2px]">
            <p className="text-xl font-semibold">AI 内容专区</p>
            <p className="text-black/50 font-semibold">根据您学习记录自动生成的巩固阅读材料</p>
          </div>
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
          <div className="mt-4 flex flex-col">
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