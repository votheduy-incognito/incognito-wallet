import CONSTANTSDK from './constant';

const { DATA_NAMES, SDK_MODULE } = CONSTANTSDK;

class SDK {
  constructor(webViewInstance) {
    if (!webViewInstance) {
      throw new Error('webViewInstance is required!');
    }

    this.webViewInstance = webViewInstance;
  }

  sendScript(script) {
    this.webViewInstance.injectJavaScript(script);
  }

  sendUpdateBalance(balance) {
    if (typeof balance !== 'number') throw new Error('balance must be a number');
    const script = `
        ${SDK_MODULE}._setData("${DATA_NAMES.BALANCE}", ${balance});
        true;
      `;
    this.sendScript(script);
  }
  
  sendUpdatePaymentAddress(address) {
    if (typeof address !== 'string') throw new Error('payment address must be a string');
    const script = `
        ${SDK_MODULE}._setData("${DATA_NAMES.PAYMENT_ADDRESS}", "${address}");
        true;
      `;
    this.sendScript(script);
  }
  
  sendUpdateTxPendingResult(data) {
    const script = `
        ${SDK_MODULE}._setData("${DATA_NAMES.TX_PENDING_RESULT}", ${JSON.stringify(data)});
        true;
      `;
    this.sendScript(script);
  }

  sendListToken(data) {
    if (!(data instanceof Array)) throw new Error('token list must be an array');
    const script = `
        ${SDK_MODULE}._setData("${DATA_NAMES.LIST_TOKEN}", ${JSON.stringify(data)});
        true;
      `;
    this.sendScript(script);
  }
}

export default SDK;