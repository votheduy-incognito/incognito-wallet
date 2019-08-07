import http from '@src/services/http';
import { CONSTANT_COMMONS } from '@src/constants';

export const genWithdrawAddress = ({ currencyType, amount, paymentAddress, walletAddress }) => {
  const parseAmount = Number(amount);

  if (!Number.isFinite(parseAmount) || parseAmount === 0) {
    throw new Error('Invalid amount');
  }

  return http.post('ota/generate', {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE_FOR_GEN_ADDRESS.WITHDRAW,
    RequestedAmount: String(parseAmount),
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress
  }).then(res => res?.Address);
};