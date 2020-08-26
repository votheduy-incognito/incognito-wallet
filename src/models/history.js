import { CONSTANT_COMMONS } from '@src/constants';

const CENTRALIZED_STATUS = {
  FAILED: [14, 15, 18, 19],
  SUCCESS: [3, 4, 5, 10],
  EXPIRED: [16],
};

const DECENTRALIZED_STATUS = {
  FAILED: [6, 9, 10, 15, 16, 23],
  SUCCESS: [7, 12],
  EXPIRED: [14],
};

const getStatusText = (status, isDecentralized) => {
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
    const status = data?.Status;
    const statusText = getStatusText(status, data.Decentralized);
    return {
      id: data?.ID,
      updatedAt: data.UpdatedAt,
      expiredAt: data.ExpiredAt,
      addressType: data.AddressType,
      status,
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
      cancelable:
        data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT &&
        [
          CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED,
          CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING,
        ].includes(statusText),
      walletAddress: data.WalletAddress,
      canRetryExpiredDeposit:
        data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT &&
        statusText === CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED,
      depositTmpAddress:
        data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT &&
        data.Address,
      privacyFee: data?.PrivacyFee,
      tokenFee: data?.TokenFee,
    };
  }
}

export default History;
