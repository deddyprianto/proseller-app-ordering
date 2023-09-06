import additionalSetting from '../config/additionalSettings';
import * as Sentry from '@sentry/react-native';

export const reportSentry = (url, body, error) => {
  const errorData = {
    url,
    body,
    error: {
      code: error.response?.resultCode,
      message: error.response?.message,
    },
  };
  if (additionalSetting().enableSentry) {
    Sentry.captureMessage(JSON.stringify(errorData), 'error');
  }
};
