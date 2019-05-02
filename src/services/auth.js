import http from './http';

// mock 
export const login = ({
  password = throw new Error('Password is required!')
}) => {
  if (password) {
    return http.get('https://httpbin.org/get');
  }
  return Promise.reject(new Error('Login failed!'));
};