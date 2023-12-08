import RNFetchBlob from 'rn-fetch-blob';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';

export const permissionDownloadFile = (url, name, mimeType, message) => {
  if (Platform.OS === 'android') {
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
      switch (result) {
        case RESULTS.DENIED:
          request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(res =>
            downloadFile(url, name, mimeType, message),
          );
          break;
        case RESULTS.GRANTED:
          downloadFile(url, name, mimeType, message);
          break;
      }
    });
  } else {
    downloadFile(url, name, mimeType, message);
  }
};

const alertMessage = (message, url, type) => {
  Alert.alert(message.title, message.description, [
    {
      text: 'Close',
    },
  ]);
};

export const downloadFile = (url, name, mimeType, message) => {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const filePath = `${RNFS.DocumentDirectoryPath}/${name}_${timestamp}.png`;

  let dirs = RNFetchBlob.fs.dirs;
  const pathAndroid = dirs.DownloadDir;

  if (Platform.OS === 'android') {
    RNFetchBlob.config({
      fileCache: true,
      path: pathAndroid,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: name,
        path: `${pathAndroid}/${name}_${timestamp}.png`,
        mime: mimeType,
      },
    })
      .fetch('GET', url)
      .then(res => {
        alertMessage(message, res.path(), mimeType);
      });
  } else {
    RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
    })
      .promise.then(response => {
        CameraRoll.saveToCameraRoll(url);
        setTimeout(() => {
          alertMessage(message, filePath, mimeType);
        }, 500);
      })
      .catch(err => {
        console.log('Download error:', err);
      });
  }
};
