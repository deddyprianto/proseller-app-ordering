import RNFetchBlob from 'rn-fetch-blob';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';

export const permissionDownloadFile = (
  url,
  name,
  mimeType,
  isOpenDirectly,
  message,
) => {
  check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
    switch (result) {
      case RESULTS.DENIED:
        request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(res =>
          downloadFile(url, name, mimeType),
        );
        break;
      case RESULTS.GRANTED:
        downloadFile(url, name, mimeType, isOpenDirectly, message);
    }
  });
};

export const downloadFile = (url, name, mimeType, isOpenDirectly, message) => {
  let dirs = RNFetchBlob.fs.dirs;
  const path = dirs.PictureDir;
  RNFetchBlob.config({
    fileCache: true,
    path,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: name,
      mime: mimeType,
    },
  })
    .fetch('GET', url)
    .then(res => {
      if (isOpenDirectly) {
        if (Platform.OS === 'android') {
          RNFetchBlob.android.actionViewIntent(res.path(), mimeType);
        }
        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.previewDocument(res.path());
        }
      } else {
        Alert.alert(message?.title, message?.description);
      }
    });
};
