import RNFetchBlob from 'rn-fetch-blob';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import {Platform} from 'react-native';

export const permissionDownloadFile = (url, name, mimeType) => {
  check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
    switch (result) {
      case RESULTS.DENIED:
        request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(res =>
          downloadFile(url, name, mimeType),
        );
        break;
      case RESULTS.GRANTED:
        downloadFile(url, name, mimeType);
    }
  });
};

export const downloadFile = (url, name, mimeType) => {
  let dirs = RNFetchBlob.fs.dirs;
  const path = dirs.DownloadDir;
  RNFetchBlob.config({
    fileCache: true,
    path,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: name,
      path: `${path}/${name}`,
      mime: mimeType,
    },
  })
    .fetch('GET', url)
    .then(res => {
      if (Platform.OS === 'android') {
        RNFetchBlob.android.actionViewIntent(res.path(), mimeType);
      }
      if (Platform.OS === 'ios') {
        RNFetchBlob.ios.previewDocument(res.path());
      }
    });
};
