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

let renewToken = null;
let pendingSubscribers = [];
let isAlreadyFetchingAccessToken = false;

function onAccessTokenFetched(accessToken) {
  pendingSubscribers = pendingSubscribers.filter(callback => callback(accessToken));
}

function addSubscriber(callback) {
  pendingSubscribers.push(callback);
}

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
  const originalRequest = errorData?.config;

  if (__DEV__) {
    console.warn('Request failed', errResponse);
  }

  // can not get response, alert to user
  if (errorData?.isAxiosError && !errResponse) {
    console.log('errorData', errorData);
    return new ExHandler(new CustomError(ErrorCode.network_make_request_failed)).throw();
  }

  // Unauthorized
  if (errResponse.status === 401) {
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      if (typeof renewToken === 'function') {
        renewToken().then(token => {
          isAlreadyFetchingAccessToken = false;
          onAccessTokenFetched(token);
        });
      } else {
        console.error('Token was expired, but can not re-new it!');
      }
    }

    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber(accessToken => {
        originalRequest.headers.Authorization = 'Bearer ' + accessToken;
        resolve(instance(originalRequest));
      });
    });
    
    return retryOriginalRequest;
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

export const setRenewToken = (fn) => {
  if (typeof fn !== 'function') throw new Error('setRenewToken must be recieved a function');
  renewToken = fn;
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

