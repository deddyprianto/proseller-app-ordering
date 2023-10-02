/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import Main from './src/main';
import persist from './src/config/store';
import config from './src/config/awsConfig';

// sentry crashlytic
import * as Sentry from '@sentry/react-native';
import Snackbar from './src/components/snackbar';
import additionalSetting from './src/config/additionalSettings';

if (additionalSetting().enableSentry) {
  Sentry.init({
    dsn: `${config.DSN}`,
    tracesSampleRate: 1.0,
    environment: __DEV__
      ? `local_${config.environment}`
      : `${config.environment}`,
    debug: __DEV__,
  });
}
const persistStore = persist();

export default class App extends Component {
  render() {
    return (
      <Provider store={persistStore.store}>
        <PersistGate loading={null} persistor={persistStore.persistor}>
          <Snackbar />
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}

// import React, {Component} from 'react';
// import {ActivityIndicator, Alert, Picker, Text, View} from 'react-native';
// import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/integration/react';
// import {Dialog} from 'react-native-paper';
// import Main from './src/main';
// import persist from './src/config/store';
// import config from './src/config/awsConfig';

// // firebase crashlytic
// import '@react-native-firebase/crashlytics';
// // sentry crashlytic
// import * as Sentry from '@sentry/react-native';
// import codePush from 'react-native-code-push';
// import colorConfig from './src/config/colorConfig';

// Sentry.init({
//   dsn: `${config.DSN}`,
// });

// const persistStore = persist();

// let codePushOptions = {
//   updateDialog: true,
//   checkFrequency: codePush.CheckFrequency.ON_APP_START,
//   installMode: codePush.InstallMode.IMMEDIATE,
// };

// class App extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       currentStatus: '',
//       openModal: false,
//       receivedBytes: null,
//       totalBytes: null,
//     };
//   }

//   codePushStatusDidChange = status => {
//     switch (status) {
//       case codePush.SyncStatus.CHECKING_FOR_UPDATE:
//         this.setState({currentStatus: 'Checking for updates.'});
//         break;
//       case codePush.SyncStatus.DOWNLOADING_PACKAGE:
//         this.setState({currentStatus: 'Downloading package.', openModal: true});
//         break;
//       case codePush.SyncStatus.INSTALLING_UPDATE:
//         this.setState({currentStatus: 'Installing update.'});
//         break;
//       case codePush.SyncStatus.UP_TO_DATE:
//         this.setState({currentStatus: 'Up-to-date.', openModal: false});
//         console.log('Up-to-date.');
//         break;
//       case codePush.SyncStatus.UPDATE_INSTALLED:
//         console.log('Update installed.');
//         this.setState({currentStatus: 'Update installed.', openModal: false});
//         break;
//     }
//   };

//   codePushDownloadDidProgress = progress => {
//     this.setState({
//       receivedBytes: progress.receivedBytes,
//       totalBytes: progress.totalBytes,
//     });
//     console.log(
//       progress.receivedBytes + ' of ' + progress.totalBytes + ' received.',
//     );
//   };

//   renderDialogUpdate = () => {
//     let {receivedBytes, totalBytes, currentStatus, openModal} = this.state;
//     receivedBytes = (receivedBytes / totalBytes) * 100;
//     receivedBytes = isNaN(receivedBytes) ? 0 : Math.floor(receivedBytes);
//     return (
//       <Dialog dismissable={false} visible={openModal ? true : false}>
//         <Dialog.Content>
//           <View>
//             <Text
//               style={{
//                 fontSize: 15,
//                 textAlign: 'center',
//                 fontWeight: 'bold',
//                 marginBottom: 20,
//               }}>
//               Please wait, we're updating your apps.
//             </Text>
//             <ActivityIndicator
//               size={'large'}
//               color={colorConfig.store.defaultColor}
//             />

//             <Text
//               style={{
//                 fontSize: 15,
//                 textAlign: 'center',
//                 fontWeight: 'bold',
//                 marginTop: 5,
//                 color: colorConfig.store.defaultColor,
//               }}>
//               {currentStatus}
//             </Text>
//             <Text
//               style={{
//                 fontSize: 15,
//                 textAlign: 'center',
//                 fontWeight: 'bold',
//                 marginVertical: 5,
//                 color: colorConfig.store.defaultColor,
//               }}>
//               <Text style={{color: 'black', fontSize: 15}}>
//                 {receivedBytes} %
//               </Text>
//             </Text>
//           </View>
//         </Dialog.Content>
//       </Dialog>
//     );
//   };

//   render() {
//     return (
//       <Provider store={persistStore.store}>
//         <PersistGate loading={null} persistor={persistStore.persistor}>
//           <Main />
//           {this.renderDialogUpdate()}
//         </PersistGate>
//       </Provider>
//     );
//   }
// }

// export default codePush(codePushOptions)(App);
