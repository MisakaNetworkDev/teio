import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { personOutline, bookOutline, chatbubblesOutline } from 'ionicons/icons';
import LoginPage from './pages/LoginPage';
import LearnTab from './pages/LearnTab';
import UserTab from './pages/UserTab';
import CommunityTab from './pages/CommunityTab';
import SettingsProfile from './pages/settings/Profile';
import PostDetail from './pages/PostDetail';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';

/* Tailwind */
import './tailwind.css';

setupIonicReact({
  mode: 'ios',
  animated: true,
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/tabbed" render={() => (
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact from='/tabbed' to="/tabbed/learn" />
              <Route exact path="/tabbed/learn" component={LearnTab} />
              <Route exact path="/tabbed/user" component={UserTab} />
              <Route exact path="/tabbed/community" component={CommunityTab} />
              <Route exact path="/tabbed/article/:id" component={PostDetail} />
              <Route exact path="/tabbed/settings/profile" component={SettingsProfile} />
            </IonRouterOutlet>
            <IonTabBar translucent slot="bottom" className='pb-8 csspt-1'>
              <IonTabButton tab="learn-tab" href="/tabbed/learn">
                <IonIcon aria-hidden="true" icon={bookOutline} />
                <IonLabel>学习</IonLabel>
              </IonTabButton>
              <IonTabButton tab="community-tab" href="/tabbed/community">
                <IonIcon aria-hidden="true" icon={chatbubblesOutline} />
                <IonLabel>社区</IonLabel>
              </IonTabButton>
              <IonTabButton tab='user-tab' href='/tabbed/user'>
                <IonIcon aria-hidden="true" icon={personOutline} />
                <IonLabel>我</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )} />
        <Redirect exact from='/' to="/tabbed/learn" />
        <Route exact path="/login" component={LoginPage} />

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
