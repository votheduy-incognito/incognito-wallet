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
    try {
      this.webViewInstance.injectJavaScript(script);
    } catch (e) {
      console.error('Send script to daap view failed', e);
    }
  }

  sendUpdateTokenInfo({ balance, symbol, name }) {
    if (typeof balance !== 'number' && balance >= 0) throw new Error('invalid token balance');
    if (!!symbol && typeof symbol !== 'string') throw new Error('invalid token symbol');
    if (!!name && typeof name !== 'string') throw new Error('invalid token name');

    const script = `
        ${SDK_MODULE}._setData("${DATA_NAMES.TOKEN_INFO}", ${JSON.stringify({ balance, symbol, name })});
        true;
      `;
    this.sendScript(script);
  }
  
  sendUpdatePaymentAddress(address) {
    if (!!address && typeof address !== 'string') throw new Error('invalid payment address');
    const script = `
        ${SDK_MODULE}._setData("${DATA_NAMES.PAYMENT_ADDRESS}", "${address}");
        true;
      `;
    this.sendScript(script);
  }
  
  sendUpdateTxPendingResult({ pendingTxId, error, data }) {
    if (!pendingTxId) throw new Error('invalid pendingTxId');
    if (!error && !data) throw new Error('must be have error or data');
    const script = `
        ${SDK_MODULE}._setData("${DATA_NAMES.TX_PENDING_RESULT}", ${JSON.stringify({ pendingTxId, error, data })});
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