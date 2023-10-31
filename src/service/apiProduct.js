import awsConfig from '../config/awsConfig';
const BASE_URL_PRODUCT = awsConfig.base_url_product;
import CryptoJS from 'react-native-crypto-js';

export const fetchApiProduct = async (
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
    const response = await apiProduct(url, method, body, headers);
    // console.log('response master ', response);
    // console.log('url ', url);
    if (response.resultCode === statusCode) {
      result.success = true;
      result.response = response;
      return result;
    } else {
      result.success = false;
    }

    throw result;
  } catch (error) {
    return error;
  }
};

export const apiProduct = async (url, method, body = null, headers = {}) => {
  try {
    const endPoint = BASE_URL_PRODUCT.concat(url);
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
    console.log(endPoint);
    var response = await fetch(endPoint, fetchParams);
    response = await response.json();

    return response;
  } catch (e) {
    return e;
  }
};
