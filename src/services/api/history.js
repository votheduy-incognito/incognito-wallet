import http from '@src/services/http';
import historyModel from '@src/models/history';

export const getpTokenHistory = ({ currencyType, paymentAddress }) => {
  if (!currencyType) throw new Error('Missing history currency type');

  return http.get('ota/history', {
    params: {
      WalletAddress: paymentAddress
    }
  }).then(res => {
    const data = [];
    res && res.forEach(history => {
      if (history?.CurrencyType === currencyType) {
        data.push(historyModel.parsePrivateTokenFromApi(history));
      }
    });

    return data;
  });
};