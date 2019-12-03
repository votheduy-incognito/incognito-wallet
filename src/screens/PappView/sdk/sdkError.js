import sdk from 'papp-sdk';

const { sdkError, ERROR_CODE } = sdk;

const createError = (code, message) => sdkError(code, message);

export default {
  createError,
  ERROR_CODE,
  user_cancel_send_tx: createError(ERROR_CODE.USER_CANCEL_SEND_TX, 'User cancel send tx request')
};