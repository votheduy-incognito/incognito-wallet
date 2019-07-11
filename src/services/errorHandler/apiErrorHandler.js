import messageCode from './messageCode';

const errorCode = {
  '-1000': messageCode.code.api_email_invalid,
  '-1005': messageCode.code.api_email_existed,
  '-1017': messageCode.code.api_device_id_existed
};

export default {
  getErrorMessageCode: err => errorCode[err.Code]
};