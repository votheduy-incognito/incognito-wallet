import { CONSTANT_COMMONS } from '@src/constants';

const getStatusText = (status, currencyType) => {
  if ([CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH, CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20].includes(currencyType)) {
    // decentralized token history 
    if (status === 6 || status === 23) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED;
    } else if (status === 7 || status === 12) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS;
    }
    return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING;
  } else {
    // centralized token history 
    if ([3, 4, 5, 10].includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS;
    }
    return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING;
  }
};
 
class History {
  static parsePrivateTokenFromApi(data = {}) {
    return {
      address: data.Address,
      updatedAt: data.UpdatedAt,
      addressType: data.AddressType,
      status: data.Status,
      statusText: getStatusText(data.Status, data.CurrencyType),
      currencyType: data.CurrencyType,
      userPaymentAddress: data.UserPaymentAddress,
      requestedAmount: data.RequestedAmount,
      receivedAmount: data.ReceivedAmount,
      incognitoAmount: data.IncognitoAmount,
      incognitoTx: data.IncognitoTx,
      outsideChainTx: data.OutsideChainTx,
    };
  }
}

export default History;