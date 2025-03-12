import { IonAvatar, IonButton, IonContent, IonItem, IonLabel, IonList, IonPage, useIonViewWillEnter } from '@ionic/react';
import avatar from '../mocks/images/avatar.jpg'
import { useState } from 'react';
import ListIcon from '../components/ListIcon'
import { seiunClient, UserModule } from '../api';

interface DataCardProps {
  // bgFrom: string,
  // bgTo: string,
  title: string,
  value: string | number
}

const DataCard = (props: DataCardProps) => {
  return (
    <div className='w-full px-3 py-2.5 flex flex-col justify-center'>
      <div className='flex flex-row justify-center'>
        <p className='text-2xl font-bold'>{props.value}</p>
      </div>
      <div className='flex flex-row justify-center'>
        <p className='text-[var(--text-light)]'>{props.title}</p>
      </div>
    </div>
  )
}

const UserTab: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    avatarUrl: avatar,
    nickName: "白芷 WhitePaper",
    userName: "WhitePaper233",
    totalWords: 4527,
    totalDays: 245,
    rank: 235,
    joinTime: 1740388519,
  })


  useIonViewWillEnter(() => {
    const userModule = new UserModule(seiunClient);
    const fetchUser = async () => {
      const userProfile = await userModule.getUserProfile('019585d0-c999-7255-81d8-7839baac74e2');
      console.log(userProfile);
      const tokens = await userModule.loginViaPhone('13851906027', 'bbbA123456');
      console.log(tokens);
    }
    fetchUser();
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
            <IonAvatar class='mx-auto w-20 mt-12 mb-12'>
              <img src={userInfo.avatarUrl} alt="user_avatar" />
            </IonAvatar>
            <div className='flex flex-row justify-center'>
              <span className='text-2xl font-bold'>{userInfo.nickName}</span>
            </div>
            <div className='flex flex-row justify-center mt-1.5'>
              <span className='text-lg text-[var(--text-light)]'>@{userInfo.userName}</span>
              <span className='text-lg mx-1 text-[var(--text-light)]'>·</span>
              <span className='text-lg text-[var(--text-light)]'>{dateFormater.format(userInfo.joinTime * 1000).replaceAll('/', ' ')} 加入</span>
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

            <IonButton expand='block' className='mx-4' color='danger'>退出登录</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage >
  );
};

export default UserTab;