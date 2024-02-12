import {Platform} from 'react-native';
import {check, PERMISSIONS} from 'react-native-permissions';

export const checkLocationPermission = async () => {
  try {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const status = await check(permission);

    if (status === 'granted') {
      return 'granted';
    } else {
      return 'denied';
    }
  } catch (err) {
    return 'error';
  }
};
