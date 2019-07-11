import messageCode from './messageCode';

class CustomError extends Error {
  constructor(name = 'CustomError', code = messageCode.code.general, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = name;
    this.code = code;
    this.message = params?.message ?? messageCode.message[code];
    
    // Custom debugging information
    this.date = new Date();
  }
}

const createError = ({ name, code, message }) => {
  return new CustomError(name, code, message);
};

export default createError;
