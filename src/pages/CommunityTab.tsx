import { IonContent, IonHeader, IonPage, IonRippleEffect, IonTitle, IonToolbar } from "@ionic/react"
import { Swiper, SwiperSlide } from 'swiper/react';
import PostCard from "../components/PostCard";
import { useState } from "react";

import 'swiper/css';

const CommunityTab: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      tag: "Nature",
      title: "The Hidden Pathway to Serenity",
      desc: "A journey through a hidden passage, where the horizon meets the heart\'s longing for peace.",
      id: "01",
      cover: "/community/cover1.jpg",
      ai: true
    },
    {
      tag: "SchoolLife",
      title: "The First Day of a New Journey",
      desc: "Three friends stand before their future, their hearts filled with dreams and anticipation.",
      id: "02",
      cover: "/community/cover2.jpg",
      ai: true
    },
    {
      tag: "Imagination",
      title: "Drifting Between Worlds",
      desc: "A girl lost in the depths of her imagination, where reality and dreams intertwine like waves in the ocean.",
      id: "03",
      cover: "/community/cover3.jpg",
      ai: true
    },
  ])

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
              posts.map((post, index) => (
                <SwiperSlide key={index} className="!w-[85%] ion-activatable rounded-4xl relative overflow-hidden">
                  <PostCard
                    key={post.id}
                    title={post.title}
                    desc={post.desc}
                    tag={post.tag}
                    id={post.id}
                    cover={post.cover}
                    ai={post.ai}
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
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CommunityTab;