/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */
import awsConfig from '../config/awsConfig';
const BASE_URL = awsConfig.base_url;
import CryptoJS from 'react-native-crypto-js';

export const api = async (url, method, body = null, headers = {}) => {
  try {
    const endPoint = BASE_URL.concat(url);
    const reqBody = body ? JSON.stringify(body) : null;

    const fetchParams = {method, headers};

    if ((method === 'POST' || method === 'PUT') && !reqBody) {
      throw new Error('Request body required');
    }

    if (reqBody) {
      fetchParams.headers['Content-type'] = 'application/json';
      fetchParams.body = reqBody;
    }

    const fetchPromise = fetch(endPoint, fetchParams);

    const timeOutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Request Timeout');
      }, 5000);
    });

    const response = await Promise.race([fetchPromise, timeOutPromise]);

    return response;
  } catch (e) {
    return e;
  }
};

export const fetchApi = async (
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
      headers['Authorization'] = `bearer ${token}`;
    }

    // const response = await fetchJson(method, path, data, token)
    const response = await api(url, method, body, headers);
    // console.log('RESPONSE MASTER API', response)
    if (response.status === statusCode) {
      result.success = true;

      if (response.headers.get('Authorization')) {
        result.token = response.headers.get('Authorization');
      }

      let responseBody;
      const responseText = await response.text();

      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        responseBody = responseText;
      }

      result.responseBody = responseBody;
      console.log(result);
      return result;
    }

    let errorBody;
    const errorText = await response.text();

    try {
      errorBody = JSON.parse(errorText);
    } catch (e) {
      errorBody = errorText;
    }
    result.responseBody = errorBody;

    throw result;
  } catch (error) {
    return error;
  }
};
