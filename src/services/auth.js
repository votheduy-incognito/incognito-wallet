import http from './http';


// mock 
export const login = ({
  username = throw new Error('Username is required!'),
  password = throw new Error('Password is required!')
}) => {
  if (username && password) {
    return http.get('https://httpbin.org/get');
  }
  return Promise.reject();
};