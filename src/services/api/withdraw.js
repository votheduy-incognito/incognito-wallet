import http from '@src/services/http';
import { CONSTANT_COMMONS } from '@src/constants';

export const genCentralizedWithdrawAddress = ({ amount, paymentAddress, walletAddress, tokenId }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!walletAddress) return throw new Error('Missing walletAddress');
  if (!tokenId) return throw new Error('Missing tokenId');

  const parseAmount = Number(amount);

  if (!Number.isFinite(parseAmount) || parseAmount === 0) {
    throw new Error('Invalid amount');
  }

  return http.post('ota/generate', {
    CurrencyType: CONSTANT_COMMONS.CURRENCY_TYPE_FOR_GEN_ADDRESS.BTC,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE_FOR_GEN_ADDRESS.WITHDRAW,
    RequestedAmount: String(parseAmount),
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress,
    PrivacyTokenAddress: tokenId,
  }).then(res => res?.Address);
};


export const genETHWithdrawAddress = ({ amount, paymentAddress, walletAddress, tokenId }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!walletAddress) return throw new Error('Missing walletAddress');
  if (!tokenId) return throw new Error('Missing tokenId');

  const parseAmount = Number(amount);

  if (!Number.isFinite(parseAmount) || parseAmount === 0) {
    return throw new Error('Invalid amount');
  }

  return http.post('eta/generate', {
    CurrencyType: CONSTANT_COMMONS.CURRENCY_TYPE_FOR_GEN_ADDRESS.ETH,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE_FOR_GEN_ADDRESS.WITHDRAW,
    RequestedAmount: String(parseAmount),
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    Erc20TokenAddress: '',
    PrivacyTokenAddress: tokenId
  }).then(res => res?.Address);
};

export const genERC20WithdrawAddress = ({ amount, paymentAddress, walletAddress, tokenId, tokenContractID }) => {
  if (!paymentAddress) return throw new Error('Missing paymentAddress');
  if (!walletAddress) return throw new Error('Missing walletAddress');
  if (!tokenId) return throw new Error('Missing tokenId');
  if (!tokenContractID) return throw new Error('Missing tokenContractID');

  const parseAmount = Number(amount);

  if (!Number.isFinite(parseAmount) || parseAmount === 0) {
    return throw new Error('Invalid amount');
  }

  return http.post('eta/generate', {
    CurrencyType: CONSTANT_COMMONS.CURRENCY_TYPE_FOR_GEN_ADDRESS.ERC20,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE_FOR_GEN_ADDRESS.WITHDRAW,
    RequestedAmount: String(parseAmount),
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId
  }).then(res => res?.Address);
};