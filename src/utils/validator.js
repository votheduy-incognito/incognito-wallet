import Util from './Util';

export const checkEmailValid = (email) => {
  let isValid = Util.isEmailValid(email);
  return { valid: isValid };
};

export const checkFieldEmpty = (text) => {
  return text && typeof (text) === 'string' && text.replace(/\s/g, '').length > 0;
};