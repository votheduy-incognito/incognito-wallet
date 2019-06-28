import messageCode from './messageCode';

const errorCode = {
  '-1000': messageCode.code.api_email_invalid,
  '-1005': messageCode.code.api_email_existed
};

export default {
  getErrorMessageCode: err => errorCode[err.Code]
};