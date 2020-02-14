import awsConfig from '../config/awsConfig';
const BASE_URL_PRODUCT = awsConfig.base_url_product;

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
      headers['Authorization'] = `Bearer ${token}`;
    }
    // const response = await fetchJson(method, path, data, token)
    const response = await apiProduct(url, method, body, headers);
    console.log('response master ', response);
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

    if (reqBody) {
      fetchParams.headers['Content-type'] = 'application/json';
      fetchParams.body = reqBody;
    }

    var response = await fetch(endPoint, fetchParams);
    response = await response.json();

    return response;
  } catch (e) {
    return e;
  }
};
