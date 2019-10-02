import { Toast } from '@src/components/core';
import CustomError from './customError/customError';
import Message from './customError/message';

const isValidException = exception => {
  if  (exception instanceof Error) {
    return true;
  }

  if (exception?.message && exception?.name && exception?.stack) {
    return true;
  }

  return false;
};

class Exception {
  /**
   * 
   * @param {any} exception 
   * @param {string} defaultMessage 
   * `exception` can be a Error object or a string
   * `defaultMessage` will be used as friendly message (which displays to users, not for debugging)
   */
  constructor(exception : any, defaultMessage: string) {
    this.message = defaultMessage;
    
    if (isValidException(exception)) {
      this.exception = exception;

      // find friendly message
      if (exception.name === CustomError.TYPES.KNOWN_ERROR) {
        this.message = exception?.message;
      } else if (exception.name === CustomError.TYPES.API_ERROR) {
        Message[this.exception?.code] && (this.message = Message[this.exception.code]);
      } else if (exception.name === CustomError.TYPES.WEB_JS_ERROR) {
        Message[this.exception?.code] && (this.message = Message[this.exception.code]);
      }
    } else if (typeof exception === 'string') {
      this.exception = new Error(exception);
    }

    if (!this.exception) {
      this.exception = new Error('Unknown error');
    }

    /**
     * Message for debug
     */
    this.debugMessage = this.exception?.message;

    /**
     * Message for UI (display to user)
     */
    this.message = this.message ?? 'Sorry! Something went wrong.';

    if (__DEV__) {
      this._log2Console();
    }
  }

  /**
   * 
   * @param {string} message 
   * override exception message.
   * Use for debug, log,...
   */
  setDebugMessage(message: string) {
    this.debugMessage = message;
    return this;
  }

  /**
   * 
   * @param {string} message 
   * Override exception message.
   * Use for UI
   */
  setMessage(message: string) {
    this.message = message;
    return this;
  }

  // private method
  _getLog() {
    const log = `
      EXCEPTION ${this.exception?.name}
      Time: ${new Date().toUTCString()}
      User message: ${this.message}
      Debug message: ${this.debugMessage}
      Error code: ${this.exception?.code}
      Stack: ${this.exception.stack}
    `;

    return log;
  }

  // private method
  _log2Console() {
    const log = this._getLog();
    log && console.log(log);
  }

  /**
   * write log to memory or display on console.
   * Uses both memory & console as default.
   */
  writeLog({ useDisk = false, useConsole = true } = {}) {
    if (useDisk) {
      // TODO write log to file, or memory?
    }

    if (!__DEV__ && useConsole) { // only use on production, we always log to console on dev already!
      this._log2Console();
    }

    return this;
  }

  /**
   * Show a toast to UI, use `message` as default.
   * If __DEV__ is true, `debugMessage` will be displayed too.
   */
  showErrorToast() {
    let msg = this.message;
    if (__DEV__) {
      msg = `${msg}\n****** DEBUG ******\n(${this.debugMessage})`;
    }
    msg && Toast.showError(msg);
    return this;
  }

  /**
   * re-throw the exception, this must be end of chain.
   */
  throw() {
    throw this.exception;
  }
}

export default Exception;