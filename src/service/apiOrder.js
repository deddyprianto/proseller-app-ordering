import awsConfig from '../config/awsConfig';
const BASE_URL_ORDER = awsConfig.base_url_order;
import CryptoJS from 'react-native-crypto-js';

export const fetchApiOrder = async (
  url,
  method,
  body,
  statusCode,
  token = null,
  loader = false,
) => {
  try {
    const headers = {};
    const result = {
      token: null,
      success: false,
      responseBody: null,
    };
    if (token) {
      // Decrypt token
      let bytes = CryptoJS.AES.decrypt(token, awsConfig.PRIVATE_KEY_RSA);
      token = bytes.toString(CryptoJS.enc.Utf8);
      headers['Authorization'] = `Bearer ${token}`;
    }
    // const response = await fetchJson(method, path, data, token)
    const response = await apiOrder(url, method, body, headers);
    // console.log('response master basket ', response);
    if (response.resultCode === statusCode) {
      result.success = true;
      result.response = response;
      return result;
    } else {
      result.success = false;
      result.response = response;
      // return result;
    }

    throw result;
  } catch (error) {
    return error;
  }
};

export const apiOrder = async (url, method, body = null, headers = {}) => {
  try {
    const endPoint = BASE_URL_ORDER.concat(url);
    const reqBody = body ? JSON.stringify(body) : null;

    const fetchParams = {method, headers};

    fetchParams.headers['clienttimezone'] = Math.abs(
      new Date().getTimezoneOffset(),
    );

    fetchParams.headers['client-timezone'] = Math.abs(
      new Date().getTimezoneOffset(),
    );

    if (reqBody) {
      fetchParams.headers['Content-type'] = 'application/json';
      fetchParams.body = reqBody;
    }

    console.log(fetchParams, 'fetchParams');
    var response = await fetch(endPoint, fetchParams);
    response = await response.json();

    return response;
  } catch (e) {
    return e;
  }
};
