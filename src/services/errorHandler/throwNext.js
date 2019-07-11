import createError from './createError';

export default (e, { defaultCode, defaultMessage } = {}) => {
  if (e?.code) {
    throw e;
  } else {
    const newError = defaultCode ? createError({ code : defaultCode }) :  createError({ message : defaultMessage ?? e?.message });

    throw newError;
  }
};