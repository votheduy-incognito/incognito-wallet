import { CONSTANT_COMMONS } from '@src/constants';

const HISTORY_STATUS = {
  0: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.NewAddress,
  1: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.ReceivedDepositAmount,
  2: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.MintingPrivacyToken,
  3: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.MintedPrivacyToken,
  4: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SendingToMasterAccount,
  5: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SendedToMasterAccount,
  6: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.ReceivedWithdrawAmount,
  7: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.BurningPrivacyToken,
  8: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.BurnedPrivacyToken,
  9: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SendingToUserAddress,
  10: CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SendedToUserAddress
};
 
class History {
  static parsePrivateTokenFromApi(data = {}) {
    return {
      address: data.Address,
      updatedAt: data.ExpiredAt,
      addressType: data.AddressType,
      status: data.Status,
      statusText: HISTORY_STATUS[data.Status],
      currencyType: data.CurrencyType,
      userPaymentAddress: data.UserPaymentAddress,
      requestedAmount: data.RequestedAmount,
      receivedAmount: data.ReceivedAmount,
      incognitoTx: data.IncognitoTx,
      outsideChainTx: data.OutsideChainTx,
    };
  }
}

export default History;