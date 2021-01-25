import http from '@src/services/http';
import historyModel from '@src/models/history';

export const getpTokenHistory = ({ paymentAddress, tokenId, signPublicKeyEncode }) => {
  return http
    .post('eta/history', {
      WalletAddress: paymentAddress,
      PrivacyTokenAddress: tokenId,
      SignPublicKeyEncode: signPublicKeyEncode
    })
    .then((res) => {
      return (
        res &&
        res.map((history) => {
          return historyModel.parsePrivateTokenFromApi(history);
        })
      );
    });
};

export const removeHistory = ({ historyId, currencyType, isDecentralized, signPublicKeyEncode }) => {
  if (typeof historyId !== 'number' && !Number.isFinite(historyId))
    return throw new Error('Invalid historyId');
  if (typeof currencyType !== 'number' && !Number.isFinite(currencyType))
    return throw new Error('Invalid currencyType');

  let body = {
    CurrencyType: currencyType,
    ID: historyId,
    Decentralized: Number(isDecentralized),
  };

  if (signPublicKeyEncode) {
    body.SignPublicKeyEncode = signPublicKeyEncode;
  }

  return http.post('eta/remove', body);
};

export const retryExpiredDeposit = ({
  id,
  decentralized,
  walletAddress,
  currencyType,
  userPaymentAddress,
  privacyTokenAddress,
  erc20TokenAddress,
  type,
  TxOutchain,
  signPublicKeyEncode
}) => {
  if (typeof id !== 'number' && !Number.isFinite(id)) {
    return throw new Error('Invalid history Id');
  }
  if (typeof decentralized !== 'boolean') {
    return throw new Error('Invalid decentralized');
  }
  if (typeof walletAddress !== 'string') {
    return throw new Error('Invalid walletAddress');
  }
  if (typeof currencyType !== 'number') {
    return throw new Error('Invalid currencyType');
  }
  if (typeof userPaymentAddress !== 'string') {
    return throw new Error('Invalid userPaymentAddress');
  }
  if (typeof privacyTokenAddress !== 'string') {
    return throw new Error('Invalid privacyTokenAddress');
  }
  if (typeof erc20TokenAddress !== 'string') {
    return throw new Error('Invalid erc20TokenAddress');
  }
  if (typeof type !== 'number') {
    return throw new Error('Invalid type');
  }
  if (TxOutchain && typeof TxOutchain !== 'string') {
    return throw new Error('Invalid TxOutChain');
  }
  let body = {
    ID: id,
    Decentralized: Number(decentralized),
    WalletAddress: walletAddress,
    AddressType: type,
    CurrencyType: currencyType,
    PaymentAddress: userPaymentAddress,
    PrivacyTokenAddress: privacyTokenAddress,
    Erc20TokenAddress: erc20TokenAddress,
  };

  if (signPublicKeyEncode) {
    body.SignPublicKeyEncode = signPublicKeyEncode;
  }

  if (TxOutchain) {
    body.TxOutchain = TxOutchain;
  }
  return http.post('eta/retry', body);
};
