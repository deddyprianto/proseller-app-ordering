import awsConfig from '../config/awsConfig';
const BASE_URL_LOYALTY = awsConfig.base_url_loyalty;
import CryptoJS from 'react-native-crypto-js';

export const fetchApiLoyalty = async (
  url,
  method,
  body,
  token = null,
) => {
  try {
    const headers = {};
    const result = {};
    if (token) {
      let bytes = CryptoJS.AES.decrypt(token, awsConfig.PRIVATE_KEY_RSA);
      token = bytes.toString(CryptoJS.enc.Utf8);
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiLoyalty(url, method, body, headers);
    if (response.code >= 400) {
      result.success = false;
      result.message = response.body?.message;
      result.code = response.code
    } else {
      result.success = true;
      result.response = response.body;
      return result;
    }

    throw result;
  } catch (error) {
    return error;
  }
};

export const apiLoyalty = async (url, method, body = null, headers = {}) => {
  try {
    const endPoint = BASE_URL_LOYALTY.concat(url);
    const reqBody = body ? JSON.stringify(body) : null;

    const fetchParams = {method, headers};

    fetchParams.headers['Client-Timezone'] = Math.abs(
      new Date().getTimezoneOffset(),
    );

    if (reqBody) {
      fetchParams.headers['Content-type'] = 'application/json';
      fetchParams.body = reqBody;
    }

    const response = await fetch(endPoint, fetchParams);
    const result = {
      body: await response.json(),
      code: response.status
    }

    return result;
  } catch (e) {
    return e;
  }
};
