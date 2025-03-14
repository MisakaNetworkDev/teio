import { IonAvatar, IonButton, IonContent, IonItem, IonLabel, IonList, IonPage, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { useState } from 'react';
import ListIcon from '../components/ListIcon'
import { Gender, seiunClient, UserModule, UserProfile } from '../api';
import { Dialog } from '@capacitor/dialog';
import { baseUrl } from '../utils/url';

// interface DataCardProps {
//   // bgFrom: string,
//   // bgTo: string,
//   title: string,
//   value: string | number
// }

// const DataCard = (props: DataCardProps) => {
//   return (
//     <div className='w-full px-3 py-2.5 flex flex-col justify-center'>
//       <div className='flex flex-row justify-center'>
//         <p className='text-2xl font-bold'>{props.value}</p>
//       </div>
//       <div className='flex flex-row justify-center'>
//         <p className='text-[var(--text-light)]'>{props.title}</p>
//       </div>
//     </div>
//   )
// }

const UserTab: React.FC = () => {
  const ionRouter = useIonRouter();
  const userModule = new UserModule(seiunClient);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    avatar_url: '/avatars/default.png',
    nick_name: "",
    user_name: "",
    join_time: 0,
    gender: Gender.unknown,
    is_banned: false,
    description: null,
  })

  const logout = async () => {
    const result = await Dialog.confirm({
      title: "退出账号",
      message: "确认退出当前账号并回到登录页面？"
    })
    if (result.value) {
      seiunClient.clearToken()
      ionRouter.push("/login");
    }
  }

  useIonViewWillEnter(() => {
    const fetchUserInfo = async () => {
      const userId = seiunClient.getUserId();
      if (!userId) {
        await Dialog.alert({
          title: "登录信息错误",
          message: "请重新登录！",
        });
        ionRouter.push("/login");
        return;
      }

      try {
        const profile = await userModule.getUserProfile(userId);
        setUserProfile(profile);
      } catch (err) {
        const error_message = (err as Error).message;
        console.error(error_message);
        const dialogOption = {
          title: "获取用户信息失败",
          message: error_message,
        }
        await Dialog.alert(dialogOption);
        return;
      }
    }

    fetchUserInfo();
  })

  const dateFormater = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short'
  })

  return (
    <IonPage>
      <IonContent color='light' fullscreen>
        <div className='w-full'>
          <div className='px-4 pt-6'>
            <IonAvatar class='mx-auto w-20 h-20 mt-12 mb-4'>
              <img className='w-20 h-20' src={userProfile.avatar_url ? `${baseUrl}${userProfile.avatar_url}` : '/avatars/default.png'} alt="user_avatar" />
            </IonAvatar>
            <div className='flex flex-row justify-center'>
              <span className='text-2xl font-bold'>{userProfile.nick_name}</span>
            </div>
            <div className='flex flex-row justify-center mt-1.5'>
              <span className='text-lg text-[var(--text-light)]'>@{userProfile.user_name}</span>
              <span className='text-lg mx-1 text-[var(--text-light)]'>·</span>
              <span className='text-lg text-[var(--text-light)]'>{dateFormater.format(userProfile.join_time * 1000).replaceAll('/', ' ')} 加入</span>
            </div>
            {/* <div className='grid grid-cols-3 mx-auto mt-2 divide-x-1 divide-[var(--divide-color)]'>
              <DataCard title='打卡单词' value={userInfo.totalWords} />
              <DataCard title='坚持天数' value={userInfo.totalDays} />
              <DataCard title='排名' value={`#${userInfo.rank}`} />
            </div> */}
          </div>
          <div className='mt-2'>
            <IonList inset class='bg-white'>
              <IonItem button routerLink='/tabbed/settings/profile' routerDirection='forward'>
                <ListIcon icon='mingcute:profile-fill' backgroundColor='#59BC58' foregroundColor='#ffffff' />
                <IonLabel>个人资料</IonLabel>
              </IonItem>
              <IonItem button>
                <ListIcon icon='mdi:account-cog' backgroundColor='#59BC58' foregroundColor='#ffffff' />
                <IonLabel>账号管理</IonLabel>
              </IonItem>
            </IonList>

            <IonList inset class='bg-white'>
              <IonItem button>
                <ListIcon icon='tabler:message-filled' backgroundColor='#E84A32' foregroundColor='#ffffff' />
                <IonLabel>推送设置</IonLabel>
              </IonItem>
              <IonItem button>
                <ListIcon icon='solar:book-bold' backgroundColor='#4D4DCB' foregroundColor='#ffffff' />
                <IonLabel>学习设置</IonLabel>
              </IonItem>
              <IonItem button>
                <ListIcon icon='mdi:lock' backgroundColor='#2C6EF7' foregroundColor='#ffffff' />
                <IonLabel>隐私设置</IonLabel>
              </IonItem>
            </IonList>

            <IonList inset class='bg-white'>
              <IonItem button>
                <ListIcon icon='material-symbols:hard-disk' backgroundColor='#838388' foregroundColor='#ffffff' />
                <IonLabel>缓存管理</IonLabel>
              </IonItem>
              <IonItem button>
                <ListIcon icon='material-symbols:menu-rounded' backgroundColor='#2C6EF7' foregroundColor='#ffffff' />
                <IonLabel>个人信息收集清单</IonLabel>
              </IonItem>
              <IonItem button>
                <ListIcon icon='streamline:module-three-solid' backgroundColor='#2C6EF7' foregroundColor='#ffffff' iconSize={16} />
                <IonLabel>第三方组件使用清单</IonLabel>
              </IonItem>
              <IonItem button>
                <ListIcon icon='mdi:about' backgroundColor='#838388' foregroundColor='#ffffff' />
                <IonLabel>关于我们</IonLabel>
              </IonItem>
            </IonList>

            <IonButton expand='block' className='mx-4' color='danger' onClick={logout}>退出登录</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage >
  );
};

export default UserTab;