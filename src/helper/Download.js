import RNFetchBlob from 'rn-fetch-blob';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

export const permissionDownloadFile = (url, name, mimeType, message) => {
  const storagePermission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY;

  check(storagePermission).then(result => {
    switch (result) {
      case RESULTS.DENIED:
        request(storagePermission).then(res =>
          downloadFile(url, name, mimeType, message),
        );
        break;
      case RESULTS.GRANTED:
        downloadFile(url, name, mimeType, message);
    }
  });
};

const onOpenFile = (url, type) => {
  if (Platform.OS === 'ios') {
    RNFetchBlob.ios.previewDocument(url);
  } else {
    RNFetchBlob.android.actionViewIntent(url, type);
  }
};

const alertMessage = (message, url, type) => {
  Alert.alert(message.title, message.description, [
    {
      text: 'Open',
      onPress: () => onOpenFile(url, type),
    },
    {
      text: 'Close',
    },
  ]);
};

export const downloadFile = (url, name, mimeType, message) => {
  let dirs = RNFetchBlob.fs.dirs;
  const path = dirs.DownloadDir;
  RNFetchBlob.config({
    fileCache: true,
    path,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: name,
      path: `${path}/${name}.png`,
      mime: mimeType,
    },
  })
    .fetch('GET', url)
    .then(res => {
      if (Platform.OS === 'ios') {
        CameraRoll.saveToCameraRoll(url);
        alertMessage(message, res.path(), mimeType);
      } else {
        CameraRoll.saveToCameraRoll(res.path()).then(() =>
          alertMessage(message, res.path(), mimeType),
        );
      }
    });
};
