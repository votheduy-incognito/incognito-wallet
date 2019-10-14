import axios from 'axios';
import CONFIG from '@src/constants/config';
import { CustomError, ErrorCode, ExHandler } from './exception';

const HEADERS = {'Content-Type': 'application/json'};
const TIMEOUT = 10000;

const instance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    ...HEADERS,
    Authorization: ''
  }
});

// Add a request interceptor
instance.interceptors.request.use(config => {
  // if (__DEV__) {
  //   console.debug('Send request', config);
  // }

  return config;
}, error => {
  if (__DEV__) {
    console.warn('Send request error', error);
  }

  return Promise.reject(error);
});

instance.interceptors.response.use(res => {
  const result = res?.data?.Result;

  // if (__DEV__) {
  //   console.debug('Request success', result);
  // }

  return Promise.resolve(result);
}, errorData => {
  const errResponse = errorData?.response;

  if (__DEV__) {
    console.warn('Request failed', errResponse);
  }

  // can not get response, alert to user
  if (errorData?.isAxiosError && !errResponse) {
    console.log('errorData', errorData);
    return new ExHandler(new CustomError(ErrorCode.network_make_request_failed)).throw();
  }

  // get response of error
  // wrap the error with CustomError to custom error message, or logging
  const data = errResponse?.data;
  if (data && data.Error) {
    throw new CustomError(data.Error?.Code, { name: CustomError.TYPES.API_ERROR, message: data.Error?.Message });
  }

  return Promise.reject(errorData);
});

export const setTokenHeader = token => {
  try {
    instance.defaults.headers.Authorization = `Bearer ${token}`;
  } catch {
    throw new Error('Can not set token request');
  }
};

export default instance;
/**
 * Document: https://github.com/axios/axios#instance-methodsaxios#request(config)
    axios#get(url[, config])
    axios#delete(url[, config])
    axios#head(url[, config])
    axios#options(url[, config])
    axios#post(url[, data[, config]])
    axios#put(url[, data[, config]])
    axios#patch(url[, data[, config]])
    axios#getUri([config])
 */

