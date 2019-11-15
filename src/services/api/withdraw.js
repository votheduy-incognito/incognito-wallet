import http from '@src/services/http';
import { CONSTANT_COMMONS } from '@src/constants';

export const genCentralizedWithdrawAddress = ({ amount, paymentAddress, walletAddress, tokenId, currencyType }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!walletAddress) return throw new Error('Missing walletAddress');
  if (!tokenId) return throw new Error('Missing tokenId');

  const parseAmount = Number(amount);

  if (!Number.isFinite(parseAmount) || parseAmount === 0) {
    throw new Error('Invalid amount');
  }

  return http.post('ota/generate', {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: String(parseAmount),
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress,
    PrivacyTokenAddress: tokenId,
  }).then(res => res?.Address);
};

export const addETHTxWithdraw = ({ amount, originalAmount, paymentAddress, walletAddress, tokenId, burningTxId, currencyType  }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!tokenId) return throw new Error('Missing tokenId');
  if (!burningTxId) return throw new Error('Missing burningTxId');

  const parseAmount = Number(amount);
  const parseOriginalAmount = Number(originalAmount);

  if (!Number.isFinite(parseAmount) || parseAmount === 0 || !Number.isFinite(parseOriginalAmount) || parseOriginalAmount === 0) {
    return throw new Error('Invalid amount');
  }

  return http.post('eta/add-tx-withdraw', {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: String(parseAmount),
    IncognitoAmount: String(originalAmount),
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: '',
    PrivacyTokenAddress: tokenId,
    IncognitoTx: burningTxId,
    WalletAddress: walletAddress ?? paymentAddress,
  });
};

export const addERC20TxWithdraw = ({ amount, originalAmount, paymentAddress, walletAddress, tokenContractID, tokenId, burningTxId, currencyType  }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!tokenId) return throw new Error('Missing tokenId');
  if (!tokenContractID) return throw new Error('Missing tokenContractID');
  if (!burningTxId) return throw new Error('Missing burningTxId');

  const parseAmount = Number(amount);
  const parseOriginalAmount = Number(originalAmount);

  if (!Number.isFinite(parseAmount) || parseAmount === 0 || !Number.isFinite(parseOriginalAmount) || parseOriginalAmount === 0) {
    return throw new Error('Invalid amount');
  }

  return http.post('eta/add-tx-withdraw', {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: String(parseAmount),
    IncognitoAmount: String(originalAmount),
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId,
    IncognitoTx: burningTxId,
    WalletAddress: walletAddress ?? paymentAddress,
  });
};

export const updatePTokenFee = ({ fee, paymentAddress  }) => {
  if (!fee) return throw new Error('Missing fee');
  if (!paymentAddress) return throw new Error('Missing paymentAddress');

  const parseFee = Number(fee);

  if (!Number.isFinite(parseFee) || parseFee === 0) {
    return throw new Error('Invalid fee');
  }

  return http.post('ota/update-fee', {
    Address: paymentAddress,
    TokenFee: String(fee),
  });
};