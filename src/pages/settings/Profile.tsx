import React, { useRef, useState } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonAvatar,
  IonButton,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonNote,
  IonDatetimeButton,
  IonDatetime,
} from '@ionic/react';

import './Profile.css'

const SettingsProfile: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  const [grade, setGrade] = useState<string>('其他');
  const [openBirthDaySelection, setOpenBirthDaySelection] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState({
    avatarUrl: "/avatars/default.png",
    nickName: "白芷 WhitePaper",
    userName: "WhitePaper233",
  })

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref='/user' text='我' />
          </IonButtons>
          <IonTitle>个人资料</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' fullscreen>
        <div className='ion-padding'>
          <IonHeader color='light' collapse="condense">
            <IonToolbar color='light'>
              <IonTitle size="large">个人资料</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className='w-full flex flex-row justify-center'>
            <IonButton id='select-avatar' className='mx-auto' fill="clear">
              <div className='flex flex-col w-full'>
                <IonAvatar class='mx-auto w-20 mt-4 mb-12'>
                  <img src={userInfo.avatarUrl} alt="user_avatar" />
                </IonAvatar>
                <span>更换头像</span>
              </div>
            </IonButton>
          </div>
        </div>
        <IonList inset>
          <IonItem>
            <IonInput label="昵称"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput label="签名"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>性别</IonLabel>
            <IonSelect slot='end' aria-label="性别" interface="popover" placeholder="选择性别">
              <IonSelectOption value="male">男</IonSelectOption>
              <IonSelectOption value="female">女</IonSelectOption>
              <IonSelectOption value="hidden">隐藏</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>生日</IonLabel>
            <IonDatetimeButton onClick={() => { setOpenBirthDaySelection(!openBirthDaySelection) }} slot='end' datetime="datetime"></IonDatetimeButton>
          </IonItem>
          <IonItem hidden={!openBirthDaySelection}>
            <IonDatetime id="datetime" locale='zh-CN' presentation='date'></IonDatetime>
          </IonItem>
          <IonItem button id='grade-selection'>
            <IonLabel>年级</IonLabel>
            <IonNote slot='end'>{grade}</IonNote>
          </IonItem>
        </IonList>

        <IonModal
          ref={modal}
          trigger="grade-selection"
          isOpen={false}
          onDidDismiss={() => { }}
        >
          <IonToolbar>
            <IonButtons>
              <IonButton onClick={() => modal.current!.dismiss(null, 'cancel')}>取消</IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton onClick={() => modal.current!.dismiss(grade, 'confirm')}>确认</IonButton>
            </IonButtons>
          </IonToolbar>

          <div className='w-full bg-white flex items-center justify-center'>
            <IonPicker>
              <IonPickerColumn value={grade} onIonChange={({ detail }) => setGrade(detail.value as string)}>
                <IonPickerColumnOption value="其他">其他</IonPickerColumnOption>
                <IonPickerColumnOption value="一年级">一年级</IonPickerColumnOption>
                <IonPickerColumnOption value="二年级">二年级</IonPickerColumnOption>
                <IonPickerColumnOption value="三年级">三年级</IonPickerColumnOption>
                <IonPickerColumnOption value="四年级">四年级</IonPickerColumnOption>
                <IonPickerColumnOption value="五年级">五年级</IonPickerColumnOption>
                <IonPickerColumnOption value="六年级">六年级</IonPickerColumnOption>
                <IonPickerColumnOption value="初一">初一</IonPickerColumnOption>
                <IonPickerColumnOption value="初二">初二</IonPickerColumnOption>
                <IonPickerColumnOption value="初三">初三</IonPickerColumnOption>
                <IonPickerColumnOption value="高一">高一</IonPickerColumnOption>
                <IonPickerColumnOption value="高二">高二</IonPickerColumnOption>
                <IonPickerColumnOption value="高三">高三</IonPickerColumnOption>
                <IonPickerColumnOption value="大一">大一</IonPickerColumnOption>
                <IonPickerColumnOption value="大二">大二</IonPickerColumnOption>
                <IonPickerColumnOption value="大三">大三</IonPickerColumnOption>
                <IonPickerColumnOption value="大四">大四</IonPickerColumnOption>
                <IonPickerColumnOption value="研究生">研究生</IonPickerColumnOption>
                <IonPickerColumnOption value="社会">社会</IonPickerColumnOption>
              </IonPickerColumn>
            </IonPicker>
          </div>
        </IonModal>
      </IonContent >
    </IonPage >
  );
}

export default SettingsProfile;