import { CONSTANT_COMMONS } from '@src/constants';

const CENTRALIZED_STATUS = {
  FAILED: [
    14, // RejectedIssueFromIncognito
    15, // RejectedBurnFromIncognito
  ],
  SUCCESS: [3, 4, 5, 10],
  EXPIRED: [16],
};

const DECENTRALIZED_STATUS = {
  FAILED: [6, 23],
  SUCCESS: [7, 12],
  EXPIRED: [14],
};

const getStatusText = (status, currencyType, isDecentralized) => {
  if (isDecentralized) {
    // decentralized token history 
    if (DECENTRALIZED_STATUS.FAILED.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED;
    } else if (DECENTRALIZED_STATUS.SUCCESS.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS;
    } else if (DECENTRALIZED_STATUS.EXPIRED.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED;
    }
    return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING;
  } else {
    // centralized token history 
    if (CENTRALIZED_STATUS.FAILED.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED;
    } else if (CENTRALIZED_STATUS.SUCCESS.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS;
    } else if (CENTRALIZED_STATUS.EXPIRED.includes(status)) {
      return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED;
    }
    return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING;
  }
};
 
class History {
  static parsePrivateTokenFromApi(data = {}) {
    const statusText = getStatusText(data.Status, data.CurrencyType, data.Decentralized);

    return {
      id: data?.ID,
      updatedAt: data.UpdatedAt,
      expiredAt: data.ExpiredAt,
      addressType: data.AddressType,
      status: data.Status,
      decentralized: data.Decentralized === 1,
      statusText,
      currencyType: data.CurrencyType,
      userPaymentAddress: data.UserPaymentAddress,
      erc20TokenAddress: data.Erc20TokenAddress,
      privacyTokenAddress: data.PrivacyTokenAddress,
      requestedAmount: data.RequestedAmount,
      receivedAmount: data.ReceivedAmount,
      incognitoAmount: data.IncognitoAmount,
      outchainTx: data.OutChainTx,
      inchainTx: data.InChainTx,
      cancelable: data.Status === 0,
      walletAddress: data.WalletAddress,
      canRetryExpiredDeposit: data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT && statusText === CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED,
      depositTmpAddress: data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT && data.Address
    };
  }
}

export default History;