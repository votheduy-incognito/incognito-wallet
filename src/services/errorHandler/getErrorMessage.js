import messageCode from './messageCode';

export default (e, { defaultMessage, defaultCode }) => {
  let msg = null;
  if (e?.code) {
    msg = messageCode.message[e.code];
  } else {
    msg = defaultMessage ?? messageCode.message[defaultCode];
  }

  return msg;
};