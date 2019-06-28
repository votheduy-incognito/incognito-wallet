import axios from 'axios';
import CONFIG from '@src/constants/config';
import { apiErrorHandler, messageCode, createError } from './errorHandler';

const HEADERS = {'Content-Type': 'application/json'};
const TIMEOUT = 1000;

const instance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: TIMEOUT,
  headers: HEADERS
});

instance.interceptors.response.use(null, errorData => {
  const data = errorData?.response?.data;
  if (data && data.Error) {
    throw createError({ code: apiErrorHandler.getErrorMessageCode(data.Error) || messageCode.code.api_general });
  }

  return Promise.reject(errorData);
});

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

