import http from '@src/services/http';
import historyModel from '@src/models/history';

export const getpTokenHistory = ({ paymentAddress }) => {
  return http.get('eta/history', {
    params: {
      WalletAddress: paymentAddress
    }
  }).then(res => {
    return res && res.map(history => {
      return historyModel.parsePrivateTokenFromApi(history);
    });
  });
};