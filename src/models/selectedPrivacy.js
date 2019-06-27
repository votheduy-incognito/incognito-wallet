import tokenData from '@src/constants/tokenData';

class SelectedPrivacyModel {
  static parse(basePrivacy = {}, token = {}) {
    const symbol = token.symbol || tokenData.SYMBOL.MAIN_PRIVACY;
    const name = token.name || tokenData.SYMBOL.MAIN_PRIVACY;
    return {
      amount: token.amount ?? basePrivacy.value || 0,
      tokenId: token.id,
      isToken: !!token.id,
      isMainPrivacy: !token.id,
      symbol,
      name,
      paymentAddress: basePrivacy.PaymentAddress,
      ownerAccountName: basePrivacy.name,
      additionalData: tokenData.DATA[symbol]
    };
  }
}

export default SelectedPrivacyModel;