import { CONSTANT_COMMONS } from '@src/constants';

const CENTRALIZED_STATUS = {
  FAILED: [
    [
      14, // RejectedIssueFromIncognito
      15, // RejectedBurnFromIncognito
    ]
  ],
  SUCCESS: [3, 4, 5, 10],
};

const DECENTRALIZED_STATUS = {
  FAILED: [6, 23],
  SUCCESS: [7, 12]
};

const getStatusText = (status, currencyType) => {
  if ([CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH, CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20].includes(currencyType)) {
    // decentralized token history 
    if (DECENTRALIZED_STATUS.FAILED.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED;
    } else if (DECENTRALIZED_STATUS.SUCCESS.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS;
    }
    return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING;
  } else {
    // centralized token history 
    if (CENTRALIZED_STATUS.FAILED.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED;
    } else if (CENTRALIZED_STATUS.SUCCESS.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS;
    }
    return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING;
  }
};
 
class History {
  static parsePrivateTokenFromApi(data = {}) {
    return {
      id: data?.ID,
      address: data.Address,
      updatedAt: data.UpdatedAt,
      addressType: data.AddressType,
      status: data.Status,
      statusText: getStatusText(data.Status, data.CurrencyType),
      currencyType: data.CurrencyType,
      userPaymentAddress: data.UserPaymentAddress,
      erc20TokenAddress: data.Erc20TokenAddress,
      requestedAmount: data.RequestedAmount,
      receivedAmount: data.ReceivedAmount,
      incognitoAmount: data.IncognitoAmount,
      incognitoTx: data.IncognitoTx,
      ethereumTx: data.EthereumTx,
      erc20TokenTx: data.Erc20TokenTx,
      cancelable: data.Status === 0
    };
  }
}

export default History;