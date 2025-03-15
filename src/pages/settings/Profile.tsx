import React, { useEffect, useState } from 'react';
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
  useIonViewWillEnter,
  useIonRouter,
  // IonModal,
  // IonPicker,
  // IonPickerColumn,
  // IonPickerColumnOption,
  // IonNote,
  // IonDatetimeButton,
  // IonDatetime,
} from '@ionic/react';

import './Profile.css'
import { Gender, seiunClient, UserModule, UserProfile } from '../../api';
import { showTokenInfoMissingDialog } from '../../utils/dialogs';
import { Dialog } from '@capacitor/dialog';
import { Camera, CameraResultType } from '@capacitor/camera';
import { photoToFormData } from '../../utils/formData';
import { baseUrl } from '../../utils/url';
import { AuthError, RequestError } from '../../api/core/client';


const SettingsProfile: React.FC = () => {
  // const modal = useRef<HTMLIonModalElement>(null);

  // const [grade, setGrade] = useState<string>('其他');
  // const [openBirthDaySelection, setOpenBirthDaySelection] = useState<boolean>(false);

  const ionRouter = useIonRouter();
  const userModule = new UserModule(seiunClient, async () => {
    ionRouter.push('/login', 'root');
    await showTokenInfoMissingDialog();
  });

  const [profileChanged, setProfileChanged] = useState<boolean>(false);
  const [gender, setGender] = useState<Gender>(2);
  const [description, setDescription] = useState<string | null>(null);
  const [nickName, setNickName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async () => {
    const userId = seiunClient.getUserId();
    if (userId) {
      let userProfile: UserProfile;
      try {
        userProfile = await userModule.getUserProfile(userId);
      } catch (err) {
        if (err instanceof AuthError) return;
        await Dialog.alert({
          title: "请求用户资料错误",
          message: (err as RequestError).message,
        });
        return;
      }
      setProfile(userProfile);
      setGender(userProfile.gender);
      setDescription(userProfile.description);
      setNickName(userProfile.nick_name);
      setAvatarUrl(userProfile.avatar_url);

      setProfileChanged(false);
    } else {
      ionRouter.push('/login', 'root');
      await showTokenInfoMissingDialog();
    }
  };

  const updateProfile = async () => {
    try {
      await userModule.updateUserProfile({
        nick_name: nickName,
        description: description,
        gender: gender,
      });
      await Dialog.alert({
        title: "更新用户资料成功",
        message: "成功更新资料",
      });
    } catch (err) {
      if (err instanceof AuthError) return;
      await Dialog.alert({
        title: "更新用户资料错误",
        message: (err as RequestError).message,
      });
      return;
    }
    await fetchUserProfile();
  }

  const selectPhoto = async () => {
    const permissionResult = await Camera.checkPermissions();
    if (permissionResult.photos === 'denied' || permissionResult.camera === 'denied') {
      await Camera.requestPermissions({
        permissions: ['photos', 'camera']
      });
    }
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
    });
    try {
      const formData = await photoToFormData("avatarFile", image);
      await userModule.uploadAvatar(formData);
      await Dialog.alert({
        title: "上传头像成功",
        message: "更新用户资料成功",
      });
    } catch (err) {
      const error_message = (err as Error).message;
      if (error_message === "Unauthorized") {
        return;
      }
      await Dialog.alert({
        title: "上传头像失败",
        message: (err as Error).message,
      });
    } finally {
      fetchUserProfile();
    }
  }

  useIonViewWillEnter(() => {
    fetchUserProfile();
  })

  useEffect(() => {
    if (profile === null) return;
    if (profile.nick_name !== nickName || profile.description !== description || profile.gender !== gender) {
      setProfileChanged(true);
    }
  }, [profile, gender, description, nickName])

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref='/tabbed/user' text='我' />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton disabled={!profileChanged} onClick={updateProfile}>提交</IonButton>
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
            <IonButton onClick={selectPhoto} id='select-avatar' className='mx-auto' fill="clear">
              <div className='flex flex-col w-full'>
                <IonAvatar class='mx-auto w-20 h-20 mt-4 mb-4'>
                  <img className='w-20 h-20' src={avatarUrl ? `${baseUrl}${avatarUrl}` : "/avatars/default.png"} alt="user_avatar" />
                </IonAvatar>
                <span>更换头像</span>
              </div>
            </IonButton>
          </div>
        </div>
        <IonList inset>
          <IonItem>
            <IonInput value={nickName} onIonChange={e => setNickName(e.detail.value ?? "")} label="昵称"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput value={description} onIonChange={e => setDescription(e.detail.value ?? "")} label="签名"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>性别</IonLabel>
            <IonSelect value={gender} onIonChange={e => { setGender(e.detail.value) }} slot='end' aria-label="性别" interface="action-sheet" placeholder="选择性别" >
              <IonSelectOption value={0}>男</IonSelectOption>
              <IonSelectOption value={1}>女</IonSelectOption>
              <IonSelectOption value={2}>隐藏</IonSelectOption>
            </IonSelect>
          </IonItem>
          {/* <IonItem>
            <IonLabel>生日</IonLabel>
            <IonDatetimeButton onClick={() => { setOpenBirthDaySelection(!openBirthDaySelection) }} slot='end' datetime="datetime"></IonDatetimeButton>
          </IonItem>
          <IonItem hidden={!openBirthDaySelection}>
            <IonDatetime id="datetime" locale='zh-CN' presentation='date'></IonDatetime>
          </IonItem>
          <IonItem button id='grade-selection'>
            <IonLabel>年级</IonLabel>
            <IonNote slot='end'>{grade}</IonNote>
          </IonItem> */}
        </IonList>

        {/* <IonModal
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
        </IonModal> */}
      </IonContent >
    </IonPage >
  );
}

export default SettingsProfile;