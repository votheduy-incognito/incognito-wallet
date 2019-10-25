const createError = (code, message) => ({
  code, message
});

export default {
  createError,
  user_cancel_send_tx: createError('user_cancel_send_tx', 'User cancel send tx request')
};