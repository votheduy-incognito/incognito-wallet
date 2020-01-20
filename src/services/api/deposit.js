import http from '@src/services/http';
import { CONSTANT_COMMONS } from '@src/constants';

export const genCentralizedDepositAddress = ({ paymentAddress, walletAddress, tokenId, currencyType }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!walletAddress) return throw new Error('Missing walletAddress');
  if (!tokenId) return throw new Error('Missing tokenId');

  // const parseAmount = Number(amount);

  // if (!Number.isFinite(parseAmount) || parseAmount === 0) {
  //   return throw new Error('Invalid amount');
  // }

  return http.post('ota/generate', {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    PrivacyTokenAddress: tokenId,
  }).then(res => res?.Address);
};

export const genETHDepositAddress = ({ paymentAddress, walletAddress, tokenId, currencyType }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!walletAddress) return throw new Error('Missing walletAddress');
  if (!tokenId) return throw new Error('Missing tokenId');

  // const parseAmount = Number(amount);

  // if (!Number.isFinite(parseAmount) || parseAmount === 0) {
  //   return throw new Error('Invalid amount');
  // }

  return http.post('eta/generate', {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    Erc20TokenAddress: '',
    PrivacyTokenAddress: tokenId
  }).then(res => res?.Address);
};

export const genERC20DepositAddress = ({ paymentAddress, walletAddress, tokenId, tokenContractID, currencyType }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!walletAddress) return throw new Error('Missing walletAddress');
  if (!tokenId) return throw new Error('Missing tokenId');
  if (!tokenContractID) return throw new Error('Missing tokenContractID');

  // const parseAmount = Number(amount);

  // if (!Number.isFinite(parseAmount) || parseAmount === 0) {
  //   return throw new Error('Invalid amount');
  // }

  return http.post('eta/generate', {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId
  }).then(res => res?.Address);
};