import additionalSetting from '../config/additionalSettings';
import * as Sentry from '@sentry/react-native';

export const reportSentry = (url, body, error) => {
  let statusCode = '';

  if (typeof error === 'object') {
    statusCode = error?.responseBody?.resultCode || '';
  }

  const errorData = {
    url,
    body,
    error,
  };

  if (additionalSetting().enableSentry && statusCode !== '401') {
    Sentry.captureMessage(JSON.stringify(errorData), 'error');
  }
};
